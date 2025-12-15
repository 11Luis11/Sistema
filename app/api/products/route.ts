import { sql } from '@/lib/database';
import { validateProduct } from '@/lib/security/input-validation';
import { apiLimiter } from '@/lib/security/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

// Helper to extract role
function getRoleFromRequest(request: NextRequest): string | null {
  return request.headers.get('X-User-Role') || null;
}

// Helper to get user ID from header
function getUserIdFromRequest(request: NextRequest): number | null {
  const userIdHeader = request.headers.get('X-User-Id');
  return userIdHeader ? parseInt(userIdHeader) : null;
}

// Helper: extrae ID desde URL con soporte para /api/products/123 y /api/products?id=123
function extractId(request: NextRequest): number | null {
  const url = new URL(request.url);

  // caso /api/products?id=123
  const paramId = url.searchParams.get('id');
  if (paramId) return Number(paramId);

  // caso /api/products/123
  const parts = url.pathname.split('/');
  const last = parts[parts.length - 1];

  const numericId = Number(last);
  if (!isNaN(numericId)) return numericId;

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitCheck = apiLimiter.check(`products:get:${ip}`);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const searchPattern = `%${search}%`;
    const category = categoryId ? parseInt(categoryId) : null;

    // Construcción de query más eficiente usando una sola consulta con condiciones dinámicas
    let whereConditions = sql`p.active = true`;
    
    if (search) {
      whereConditions = sql`${whereConditions} AND (p.name ILIKE ${searchPattern} OR p.code ILIKE ${searchPattern})`;
    }
    
    if (category) {
      whereConditions = sql`${whereConditions} AND p.category_id = ${category}`;
    }

    const products = await sql`
      SELECT 
        p.id, p.code, p.name, p.description, p.price, p.current_stock,
        p.size, p.color, p.gender, c.name AS category,
        p.created_at, p.updated_at
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      WHERE ${whereConditions}
      ORDER BY p.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('[Products GET Error]', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching products', error_code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitCheck = apiLimiter.check(`products:post:${ip}`);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const role = getRoleFromRequest(request);

    if (!['Administrator', 'Manager', 'ADM_INV'].includes(role || '')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: insufficient permissions', error_code: 'UNAUTHORIZED' },
        { status: 403 }
      );
    }

    // Obtener user_id del header
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID required', error_code: 'USER_ID_REQUIRED' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = validateProduct(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid product data',
          errors: validation.error.flatten(),
          error_code: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    const { code, name, description, categoryId, price, size, color, gender, stock } =
      validation.data;

    const priceValue = Number(price);
    if (isNaN(priceValue)) {
      return NextResponse.json(
        { success: false, message: 'Price must be a valid number' },
        { status: 400 }
      );
    }

    const existing = await sql`
      SELECT id FROM products WHERE UPPER(code) = UPPER(${code})
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Product code already exists',
          error_code: 'DUPLICATE_CODE',
        },
        { status: 409 }
      );
    }

    const initialStock = stock || 0;

    // Insertar producto
    const result = await sql`
      INSERT INTO products (code, name, description, category_id, price, size, color, gender, current_stock, active)
      VALUES (${code}, ${name}, ${description}, ${categoryId}, ${priceValue}, ${size}, ${color}, ${gender}, ${initialStock}, true)
      RETURNING *
    `;

    const newProduct = result[0];

    // Registrar movimiento inicial solo si hay stock
if (initialStock > 0) {
  try {
    await sql`
      INSERT INTO inventory_movements (
        product_id, user_id, movement_type, quantity, previous_stock, new_stock, reason
      )
      VALUES (
        ${newProduct.id}, ${userId}, 'ENTRADA', ${initialStock}, 0, ${initialStock}, 'Stock inicial del producto'
      )
    `;
  } catch (movementError) {
    console.error('[Movement Insert Error]', movementError);
  }
}

// Notificar si stock inicial es crítico (threshold = 5)
try {
  const threshold = 5;
  if (initialStock <= threshold) {
    // createNotification helper
    const { createNotification } = await import('@/lib/notifications');
    await createNotification('stock_critico', `Producto ${newProduct.name} creado con stock bajo (${initialStock})`, { productId: newProduct.id, stock: initialStock });
  }
} catch (err) {
  console.error('[Stock notification error]', err);
}


    return NextResponse.json(
      { success: true, message: 'Product created successfully', product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Products POST Error]', error);
    return NextResponse.json(
      { success: false, message: 'Error creating product', error_code: 'CREATE_ERROR' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitCheck = apiLimiter.check(`products:delete:${ip}`);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const role = getRoleFromRequest(request);

    if (!['Administrator', 'Manager', 'ADM_INV'].includes(role || '')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: insufficient permissions' },
        { status: 403 }
      );
    }

    const productId = extractId(request);

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID required' },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM products
      WHERE id = ${productId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Products DELETE Error]', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting product' },
      { status: 500 }
    );
  }
}