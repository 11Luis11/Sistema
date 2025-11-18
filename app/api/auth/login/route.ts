import { sql } from '@/lib/database';
import { hashPassword, verifyPassword } from '@/lib/security/password-hash';
import { checkLoginAttempts, recordFailedAttempt, clearLoginAttempts } from '@/lib/security/login-attempts';
import { validateLogin, sanitizeString } from '@/lib/security/input-validation';
import { apiLimiter } from '@/lib/security/rate-limit';
import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitCheck = apiLimiter.check(`login:${ip}`);
    
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Demasiados intentos de inicio de sesión. Por favor, intenta nuevamente en 15 minutos.',
          error_code: 'RATE_LIMIT_EXCEEDED',
        },
        { status: 429, headers: { 'Retry-After': '900' } }
      );
    }

    const body = await request.json();

    const validation = validateLogin(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Por favor, verifica que el correo electrónico y la contraseña sean válidos.',
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Verificar intentos de login antes de consultar la base de datos
    const attemptCheck = checkLoginAttempts(email);
    if (!attemptCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cuenta bloqueada temporalmente. Has excedido el número máximo de intentos (3). Intenta nuevamente en 15 minutos.',
          attemptsLeft: 0,
          locked: true,
          error_code: 'ACCOUNT_LOCKED',
        },
        { status: 429 }
      );
    }

    // Buscar usuario en la base de datos
    const users = await sql`
      SELECT u.id, u.password_hash, u.email, u.role_id, u.first_name, u.last_name, u.active, r.name as role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE LOWER(u.email) = LOWER(${email}) AND (u.active = true OR u.active IS NULL)
    `;

    // Usuario no existe
    if (users.length === 0) {
      recordFailedAttempt(email);
      const remainingAttempts = Math.max(0, attemptCheck.attemptsLeft - 1);

      return NextResponse.json(
        {
          success: false,
          message: remainingAttempts > 0 
            ? `Credenciales inválidas. Te quedan ${remainingAttempts} ${remainingAttempts === 1 ? 'intento' : 'intentos'}.`
            : 'Cuenta bloqueada. Has excedido el número máximo de intentos.',
          attemptsLeft: remainingAttempts,
          locked: remainingAttempts === 0,
          error_code: 'INVALID_CREDENTIALS',
        },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verificar contraseña
    const passwordMatch = await verifyPassword(password, user.password_hash);

    if (!passwordMatch) {
      recordFailedAttempt(email);
      const remainingAttempts = Math.max(0, attemptCheck.attemptsLeft - 1);
      
      // Registrar intento fallido en audit log (usuario existe pero contraseña incorrecta)
      try {
        await sql`
          INSERT INTO login_audit_log (user_id, email, ip_address, success, timestamp)
          VALUES (${user.id}, ${email}, ${ip}, false, NOW())
        `;
      } catch (auditError) {
        console.error('[Audit Log Error]', auditError);
      }

      return NextResponse.json(
        {
          success: false,
          message: remainingAttempts > 0 
            ? `Credenciales inválidas. Te quedan ${remainingAttempts} ${remainingAttempts === 1 ? 'intento' : 'intentos'}.`
            : 'Cuenta bloqueada. Has excedido el número máximo de intentos.',
          attemptsLeft: remainingAttempts,
          locked: remainingAttempts === 0,
          error_code: 'INVALID_CREDENTIALS',
        },
        { status: 401 }
      );
    }

    // Login exitoso
    clearLoginAttempts(email);

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Registrar login exitoso en audit log
    try {
      await sql`
        INSERT INTO login_audit_log (user_id, email, ip_address, success, timestamp)
        VALUES (${user.id}, ${email}, ${ip}, true, NOW())
      `;
    } catch (auditError) {
      console.error('[Audit Log Error]', auditError);
    }

    return NextResponse.json(
      {
        success: true,
        message: '¡Bienvenido de nuevo!',
        user: {
          id: user.id,
          email: sanitizeString(user.email),
          firstName: sanitizeString(user.first_name || ''),
          lastName: sanitizeString(user.last_name || ''),
          role: user.role_name || 'USER',
          roleId: user.role_id,
        },
        sessionToken,
        expiresAt: sessionExpiry.toISOString(),
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `sessionToken=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${24 * 60 * 60}; Path=/`,
        },
      }
    );
  } catch (error) {
    console.error('[Login Error]', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Ha ocurrido un error en el servidor. Por favor, intenta nuevamente más tarde.',
        error_code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}