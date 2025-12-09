import { sql } from '@/lib/database';
import { apiLimiter } from '@/lib/security/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

function getRoleFromRequest(request: NextRequest): string | null {
  return request.headers.get('X-User-Role') || null;
}

function getUserIdFromRequest(request: NextRequest): number | null {
  const userIdHeader = request.headers.get('X-User-Id');
  return userIdHeader ? parseInt(userIdHeader) : null;
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitCheck = apiLimiter.check(`sales:get:${ip}`);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const period = parseInt(searchParams.get('period') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const sales = await sql`
      SELECT 
        s.id,
        s.sale_code,
        s.customer_name,
        s.customer_email,
        s.customer_phone,
        s.total_amount,
        s.payment_method,
        s.status,
        s.created_at,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        COUNT(si.id) as items_count
      FROM sales s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN sale_items si ON s.id = si.sale_id
      WHERE s.created_at >= ${startDate.toISOString()}
      GROUP BY s.id, u.first_name, u.last_name
      ORDER BY s.created_at DESC
      LIMIT ${limit}
    `;

    return NextResponse.json({ success: true, sales });
  } catch (error) {
    console.error('[Sales GET Error]', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching sales' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitCheck = apiLimiter.check(`sales:post:${ip}`);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { customerName, customerEmail, customerPhone, paymentMethod, notes, items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Sale must have at least one item' },
        { status: 400 }
      );
    }

    // Calcular total
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    // Generar código de venta
    const saleCount = await sql`SELECT COUNT(*) as count FROM sales`;
    const saleCode = `SALE-${String(parseInt(saleCount[0].count) + 1).padStart(6, '0')}`;

    // Insertar venta
    const saleResult = await sql`
      INSERT INTO sales (sale_code, customer_name, customer_email, customer_phone, user_id, total_amount, payment_method, notes, status)
      VALUES (${saleCode}, ${customerName || null}, ${customerEmail || null}, ${customerPhone || null}, 
              ${userId}, ${totalAmount}, ${paymentMethod || 'Efectivo'}, ${notes || null}, 'completed')
      RETURNING *
    `;

    const sale = saleResult[0];

    // Insertar items y actualizar stock
    for (const item of items) {
      // Insertar item
      await sql`
        INSERT INTO sale_items (sale_id, product_id, product_name, product_code, quantity, unit_price, subtotal)
        VALUES (${sale.id}, ${item.productId}, ${item.productName}, ${item.productCode}, 
                ${item.quantity}, ${item.unitPrice}, ${item.quantity * item.unitPrice})
      `;

      // Obtener stock actual
      const product = await sql`
        SELECT current_stock FROM products WHERE id = ${item.productId}
      `;

      const previousStock = product[0].current_stock;
      const newStock = previousStock - item.quantity;

      // Actualizar stock
      await sql`
        UPDATE products 
        SET current_stock = ${newStock}, updated_at = NOW()
        WHERE id = ${item.productId}
      `;

      // Registrar movimiento
      await sql`
        INSERT INTO inventory_movements (product_id, user_id, movement_type, quantity, previous_stock, new_stock, reason)
        VALUES (${item.productId}, ${userId}, 'SALIDA', ${item.quantity}, ${previousStock}, ${newStock}, 
                'Venta: ' || ${saleCode})
      `;
    }

    return NextResponse.json(
      { success: true, message: 'Sale created successfully', sale },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Sales POST Error]', error);
    return NextResponse.json(
      { success: false, message: 'Error creating sale' },
      { status: 500 }
    );
  }
}