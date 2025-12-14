
import { sql } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';
import { apiLimiter } from '@/lib/security/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const allowed = apiLimiter.check(`notifications:get:${ip}`);
    if (!allowed.allowed) return NextResponse.json({ success: false, message: 'Rate limit exceeded' }, { status: 429 });

    const rows = await sql`SELECT id, type, message, meta, read, created_at FROM notifications ORDER BY id DESC LIMIT 200`;
  
    return NextResponse.json({ success: true, notifications: rows });
  } catch (err) {
    console.error('[NOTIFICATIONS GET Error]', err);
    return NextResponse.json({ success: false, message: 'Error fetching notifications' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    
    await sql`UPDATE notifications SET read = true WHERE read = false`;
    return NextResponse.json({ success: true, message: 'Marked all as read' });
  } catch (err) {
    console.error('[NOTIFICATIONS PUT Error]', err);
    return NextResponse.json({ success: false, message: 'Error marking notifications' }, { status: 500 });
  }
}
