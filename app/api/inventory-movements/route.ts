import { sql } from '@/lib/database';
import { apiLimiter } from '@/lib/security/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitCheck = apiLimiter.check(`movements:get:${ip}`);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener parámetro limit de la query
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    // Obtener movimientos con información de producto y usuario
    const movements = await sql`
      SELECT 
        im.id,
        im.product_id,
        p.name as product_name,
        p.code as product_code,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        im.movement_type,
        im.quantity,
        im.previous_stock,
        im.new_stock,
        im.reason,
        im.created_at
      FROM inventory_movements im
      JOIN products p ON im.product_id = p.id
      JOIN users u ON im.user_id = u.id
      ORDER BY im.created_at DESC
      LIMIT ${limit}
    `;

    return NextResponse.json({
      success: true,
      movements
    });

  } catch (error) {
    console.error('Error fetching inventory movements:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener movimientos' },
      { status: 500 }
    );
  }
}