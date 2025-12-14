// app/api/notifications/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createNotification } from '@/lib/notifications';
import { apiLimiter } from '@/lib/security/rate-limit';

export async function POST(request: NextRequest) {
try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const allowed = apiLimiter.check(`notifications:add:${ip}`);
    if (!allowed.allowed) return NextResponse.json({ success: false, message: 'Rate limit exceeded' }, { status: 429 });

    const { type, message, meta } = await request.json();
    await createNotification(type || 'general', message || '', meta || {});
    return NextResponse.json({ success: true });
} catch (err) {
    console.error('[NOTIFICATIONS ADD Error]', err);
    return NextResponse.json({ success: false, message: 'Error creating notification' }, { status: 500 });
}
}
