import { sql } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';
import { apiLimiter } from '@/lib/security/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const allowed = apiLimiter.check(`customers:get:${ip}`);
    if (!allowed.allowed) {
      return NextResponse.json({ success: false, message: 'Rate limit exceeded' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').trim();
    const limit = Number(searchParams.get('limit') || '100');
    const offset = Number(searchParams.get('offset') || '0');

    const pattern = `%${search}%`;

    const rows = await sql`
      SELECT id, name, document, phone, email, active, created_at, updated_at
      FROM customers
      WHERE active = true
      AND (
        ${search} = '' OR name ILIKE ${pattern} OR document ILIKE ${pattern}
      )
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    return NextResponse.json({ success: true, customers: rows });
  } catch (err) {
    console.error('[CUSTOMERS GET Error]', err);
    return NextResponse.json({ success: false, message: 'Error fetching customers' }, { status: 500 });
  }
}
