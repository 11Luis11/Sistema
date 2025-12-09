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