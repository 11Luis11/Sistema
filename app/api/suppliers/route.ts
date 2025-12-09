import { sql } from '@/lib/database';
import { apiLimiter } from '@/lib/security/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

function getRoleFromRequest(request: NextRequest): string | null {
  return request.headers.get('X-User-Role') || null;
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitCheck = apiLimiter.check(`suppliers:get:${ip}`);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '100');

    const searchPattern = `%${search}%`;

    const suppliers = await sql`
      SELECT 
        s.*,
        COUNT(ps.product_id) as products_count
      FROM suppliers s
      LEFT JOIN product_suppliers ps ON s.id = ps.supplier_id
      WHERE s.active = true 
        AND (s.name ILIKE ${searchPattern} OR s.code ILIKE ${searchPattern})
      GROUP BY s.id
      ORDER BY s.created_at DESC
      LIMIT ${limit}
    `;

    return NextResponse.json({ success: true, suppliers });
  } catch (error) {
    console.error('[Suppliers GET Error]', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching suppliers' },
      { status: 500 }
    );
  }
}
