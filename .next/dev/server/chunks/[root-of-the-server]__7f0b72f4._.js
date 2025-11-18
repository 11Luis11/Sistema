module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/lib/database.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Neon database connection
__turbopack_context__.s([
    "sql",
    ()=>sql
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-route] (ecmascript)");
;
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["neon"])(process.env.DATABASE_URL);
;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/security/password-hash.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPasswordHash",
    ()=>createPasswordHash,
    "generateHashForSetup",
    ()=>generateHashForSetup,
    "hashPassword",
    ()=>hashPassword,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
const SALT_ROUNDS = 12; // Industry standard for bcrypt
async function hashPassword(password) {
    if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }
    try {
        const hash = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hash"](password, SALT_ROUNDS);
        return hash;
    } catch (error) {
        console.error('[Password Hash Error]', error);
        throw new Error('Failed to hash password');
    }
}
async function verifyPassword(password, hash) {
    try {
        if (!password || !hash) {
            return false;
        }
        const isMatch = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compare"](password, hash);
        return isMatch;
    } catch (error) {
        console.error('[Password Verify Error]', error);
        return false;
    }
}
async function generateHashForSetup(password) {
    return await hashPassword(password);
}
function createPasswordHash(password) {
    // For bcryptjs, the salt is embedded in the hash, but we return a compatible format
    // This is a synchronous version for setup scripts
    const crypto = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('hex');
    return {
        hash,
        salt
    };
}
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/lib/security/login-attempts.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkLoginAttempts",
    ()=>checkLoginAttempts,
    "clearLoginAttempts",
    ()=>clearLoginAttempts,
    "isAccountLocked",
    ()=>isAccountLocked,
    "recordFailedAttempt",
    ()=>recordFailedAttempt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$cache$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/node-cache/index.js [app-route] (ecmascript)");
;
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 15 * 60; // 15 minutes in seconds
const CACHE_CHECK_PERIOD = 60; // Clean up every 60 seconds
// Using node-cache for in-memory storage (can be replaced with Redis)
const cache = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$cache$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
    stdTTL: LOCKOUT_TIME,
    checkperiod: CACHE_CHECK_PERIOD
});
function checkLoginAttempts(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const attempt = cache.get(normalizedEmail);
    if (!attempt) {
        return {
            allowed: true,
            attemptsLeft: MAX_ATTEMPTS,
            message: 'OK'
        };
    }
    if (attempt.locked) {
        const timeLeft = Math.max(0, LOCKOUT_TIME - Math.floor((Date.now() - attempt.lastAttempt) / 1000));
        if (timeLeft <= 0) {
            cache.del(normalizedEmail);
            return {
                allowed: true,
                attemptsLeft: MAX_ATTEMPTS,
                message: 'OK'
            };
        }
        return {
            allowed: false,
            attemptsLeft: 0,
            message: `Account temporarily locked. Try again in ${timeLeft} seconds.`,
            timeToUnlock: timeLeft
        };
    }
    return {
        allowed: true,
        attemptsLeft: Math.max(0, MAX_ATTEMPTS - attempt.count),
        message: 'OK'
    };
}
function recordFailedAttempt(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const attempt = cache.get(normalizedEmail) || {
        count: 0,
        lastAttempt: Date.now(),
        locked: false
    };
    attempt.count += 1;
    attempt.lastAttempt = Date.now();
    if (attempt.count >= MAX_ATTEMPTS) {
        attempt.locked = true;
    }
    cache.set(normalizedEmail, attempt, LOCKOUT_TIME);
}
function clearLoginAttempts(email) {
    const normalizedEmail = email.toLowerCase().trim();
    cache.del(normalizedEmail);
}
function isAccountLocked(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const attempt = cache.get(normalizedEmail);
    return attempt?.locked ?? false;
}
}),
"[project]/lib/security/input-validation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoginSchema",
    ()=>LoginSchema,
    "ProductSchema",
    ()=>ProductSchema,
    "sanitizeString",
    ()=>sanitizeString,
    "validateEmail",
    ()=>validateEmail,
    "validateLogin",
    ()=>validateLogin,
    "validateProduct",
    ()=>validateProduct
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
const LoginSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email('Invalid email format').toLowerCase().trim(),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8, 'Password must be at least 8 characters')
});
const ProductSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(50).toUpperCase().trim(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(255).trim(),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(1000).trim().optional(),
    categoryId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive(),
    price: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive('Price must be positive'),
    size: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50).trim().optional(),
    color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).trim().optional(),
    gender: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(50).trim().optional(),
    stock: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative('Stock cannot be negative').default(0)
});
function validateLogin(data) {
    return LoginSchema.safeParse(data);
}
function validateProduct(data) {
    return ProductSchema.safeParse(data);
}
function validateEmail(email) {
    const emailSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email();
    const result = emailSchema.safeParse(email.toLowerCase().trim());
    return result.success;
}
function sanitizeString(input) {
    return input.replace(/[<>\"'&]/g, (char)=>{
        const map = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '&': '&amp;'
        };
        return map[char];
    });
}
}),
"[project]/lib/security/rate-limit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiLimiter",
    ()=>apiLimiter,
    "loginLimiter",
    ()=>loginLimiter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$cache$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/node-cache/index.js [app-route] (ecmascript)");
;
const DEFAULT_CONFIG = {
    windowMs: 60 * 1000,
    maxRequests: 30
};
class RateLimiter {
    cache = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$cache$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
        stdTTL: 60,
        checkperiod: 30
    });
    config;
    constructor(config = {}){
        this.config = {
            ...DEFAULT_CONFIG,
            ...config
        };
    }
    check(identifier) {
        const key = `ratelimit:${identifier}`;
        let count = this.cache.get(key) || 0;
        if (count >= this.config.maxRequests) {
            return {
                allowed: false,
                remaining: 0
            };
        }
        count += 1;
        this.cache.set(key, count, Math.ceil(this.config.windowMs / 1000));
        return {
            allowed: true,
            remaining: this.config.maxRequests - count
        };
    }
    reset(identifier) {
        this.cache.del(`ratelimit:${identifier}`);
    }
}
const apiLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 100
});
const loginLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 10
});
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/auth/login/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/database.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$password$2d$hash$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/password-hash.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$login$2d$attempts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/login-attempts.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$input$2d$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/input-validation.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/rate-limit.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
;
;
;
;
async function POST(request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimitCheck = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiLimiter"].check(`login:${ip}`);
        if (!rateLimitCheck.allowed) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Demasiados intentos de inicio de sesión. Por favor, intenta nuevamente en 15 minutos.',
                error_code: 'RATE_LIMIT_EXCEEDED'
            }, {
                status: 429,
                headers: {
                    'Retry-After': '900'
                }
            });
        }
        const body = await request.json();
        const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$input$2d$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateLogin"])(body);
        if (!validation.success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Por favor, verifica que el correo electrónico y la contraseña sean válidos.',
                errors: validation.error.flatten()
            }, {
                status: 400
            });
        }
        const { email, password } = validation.data;
        // Verificar intentos de login antes de consultar la base de datos
        const attemptCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$login$2d$attempts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkLoginAttempts"])(email);
        if (!attemptCheck.allowed) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Cuenta bloqueada temporalmente. Has excedido el número máximo de intentos (3). Intenta nuevamente en 15 minutos.',
                attemptsLeft: 0,
                locked: true,
                error_code: 'ACCOUNT_LOCKED'
            }, {
                status: 429
            });
        }
        // Buscar usuario en la base de datos
        const users = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      SELECT u.id, u.password_hash, u.email, u.role_id, u.first_name, u.last_name, u.active, r.name as role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE LOWER(u.email) = LOWER(${email}) AND (u.active = true OR u.active IS NULL)
    `;
        // Usuario no existe
        if (users.length === 0) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$login$2d$attempts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recordFailedAttempt"])(email);
            const remainingAttempts = Math.max(0, attemptCheck.attemptsLeft - 1);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: remainingAttempts > 0 ? `Credenciales inválidas. Te quedan ${remainingAttempts} ${remainingAttempts === 1 ? 'intento' : 'intentos'}.` : 'Cuenta bloqueada. Has excedido el número máximo de intentos.',
                attemptsLeft: remainingAttempts,
                locked: remainingAttempts === 0,
                error_code: 'INVALID_CREDENTIALS'
            }, {
                status: 401
            });
        }
        const user = users[0];
        // Verificar contraseña
        const passwordMatch = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$password$2d$hash$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyPassword"])(password, user.password_hash);
        if (!passwordMatch) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$login$2d$attempts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["recordFailedAttempt"])(email);
            const remainingAttempts = Math.max(0, attemptCheck.attemptsLeft - 1);
            // Registrar intento fallido en audit log (usuario existe pero contraseña incorrecta)
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
          INSERT INTO login_audit_log (user_id, email, ip_address, success, timestamp)
          VALUES (${user.id}, ${email}, ${ip}, false, NOW())
        `;
            } catch (auditError) {
                console.error('[Audit Log Error]', auditError);
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: remainingAttempts > 0 ? `Credenciales inválidas. Te quedan ${remainingAttempts} ${remainingAttempts === 1 ? 'intento' : 'intentos'}.` : 'Cuenta bloqueada. Has excedido el número máximo de intentos.',
                attemptsLeft: remainingAttempts,
                locked: remainingAttempts === 0,
                error_code: 'INVALID_CREDENTIALS'
            }, {
                status: 401
            });
        }
        // Login exitoso
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$login$2d$attempts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clearLoginAttempts"])(email);
        const sessionToken = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"](32).toString('hex');
        const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        // Registrar login exitoso en audit log
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
        INSERT INTO login_audit_log (user_id, email, ip_address, success, timestamp)
        VALUES (${user.id}, ${email}, ${ip}, true, NOW())
      `;
        } catch (auditError) {
            console.error('[Audit Log Error]', auditError);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: '¡Bienvenido de nuevo!',
            user: {
                id: user.id,
                email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$input$2d$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeString"])(user.email),
                firstName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$input$2d$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeString"])(user.first_name || ''),
                lastName: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$input$2d$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeString"])(user.last_name || ''),
                role: user.role_name || 'USER',
                roleId: user.role_id
            },
            sessionToken,
            expiresAt: sessionExpiry.toISOString()
        }, {
            status: 200,
            headers: {
                'Set-Cookie': `sessionToken=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${24 * 60 * 60}; Path=/`
            }
        });
    } catch (error) {
        console.error('[Login Error]', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Ha ocurrido un error en el servidor. Por favor, intenta nuevamente más tarde.',
            error_code: 'INTERNAL_SERVER_ERROR'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7f0b72f4._.js.map