import { sql } from '@/lib/database';
import { validateProduct } from '@/lib/security/input-validation';
import { apiLimiter } from '@/lib/security/rate-limit';
import { NextRequest, NextResponse } from 'next/server';
// ... (mantén todo lo demás igual)

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

    // Construcción de query con active = true
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

// ... (mantén POST y DELETE igual)
function getRoleFromRequest(request: NextRequest): string | null {
  return request.headers.get('X-User-Role') || null;
}

function getUserIdFromRequest(request: NextRequest): number | null {
  const userIdHeader = request.headers.get('X-User-Id');
  return userIdHeader ? parseInt(userIdHeader) : null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitCheck = apiLimiter.check(`products:put:${ip}`);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const role = getRoleFromRequest(request);

    if (!['Administrator', 'Manager'].includes(role || '')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: insufficient permissions', error_code: 'UNAUTHORIZED' },
        { status: 403 }
      );
    }

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID required', error_code: 'USER_ID_REQUIRED' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    console.log('[DEBUG PUT] Received data:', body);

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

    const { name, description, categoryId, price, size, color, gender, stock } = validation.data;

    const priceNum = Number(price);
    const categoryNum = Number(categoryId);
    const idNum = Number(id);
    const newStock = stock !== undefined ? Number(stock) : null;

    console.log('[DEBUG PUT] Processing update for product:', idNum);

    // Obtener stock actual antes de actualizar
    const currentProduct = await sql`
      SELECT current_stock FROM products WHERE id = ${idNum} AND active = true
    `;

    if (currentProduct.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found', error_code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const previousStock = currentProduct[0].current_stock;

    // Actualizar producto
    let result;
    if (newStock !== null) {
      result = await sql`
        UPDATE products 
        SET name = ${name},
            description = ${description || ''},
            category_id = ${categoryNum},
            price = ${priceNum},
            size = ${size || ''},
            color = ${color || ''},
            gender = ${gender || ''},
            current_stock = ${newStock},
            updated_at = NOW()
        WHERE id = ${idNum} AND active = true
        RETURNING *
      `;
    } else {
      result = await sql`
        UPDATE products 
        SET name = ${name},
            description = ${description || ''},
            category_id = ${categoryNum},
            price = ${priceNum},
            size = ${size || ''},
            color = ${color || ''},
            gender = ${gender || ''},
            updated_at = NOW()
        WHERE id = ${idNum} AND active = true
        RETURNING *
      `;
    }

    console.log('[DEBUG PUT] Product updated:', result[0]);

    // Registrar movimiento si cambió el stock
    if (newStock !== null && previousStock !== newStock) {
      const quantity = newStock - previousStock;
      const movementType = quantity > 0 ? 'ENTRADA' : 'SALIDA';
      
      await sql`
        INSERT INTO inventory_movements (
          product_id, user_id, movement_type, quantity, previous_stock, new_stock, reason
        )
        VALUES (
          ${idNum}, ${userId}, ${movementType}, ${Math.abs(quantity)}, ${previousStock}, ${newStock}, 'Ajuste de inventario desde edición de producto'
        )
      `;

      console.log('[DEBUG PUT] Movement created:', movementType, Math.abs(quantity));
    }

    return NextResponse.json({
      success: true,
      product: result[0],
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('[Update Product Error]', error);
    return NextResponse.json(
      { success: false, message: 'Error updating product', error_code: 'UPDATE_ERROR' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
        { success: false, message: 'Unauthorized: insufficient permissions', error_code: 'UNAUTHORIZED' },
        { status: 403 }
      );
    }

    const productId = Number(id);

    // SOFT DELETE: cambiar active a false en lugar de borrar
    const result = await sql`
      UPDATE products
      SET active = false, updated_at = NOW()
      WHERE id = ${productId} AND active = true
      RETURNING id, name
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Product not found or already deleted', error_code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      product: result[0]
    });
  } catch (error) {
    console.error('[Delete Product Error]', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting product', error_code: 'DELETE_ERROR' },
      { status: 500 }
    );
  }
}