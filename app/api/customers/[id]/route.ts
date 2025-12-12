import { sql } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';
import { apiLimiter } from '@/lib/security/rate-limit';
import { createNotification } from '@/lib/notifications';

export async function PUT(request: NextRequest, { params }: any) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const allowed = apiLimiter.check(`customers:put:${ip}`);
    if (!allowed.allowed) return NextResponse.json({ success: false, message: 'Rate limit exceeded' }, { status: 429 });

    const id = Number(params.id);
    const body = await request.json();
    const { name, document, phone, email, userId } = body;

    if (!id) return NextResponse.json({ success: false, message: 'Customer id required' }, { status: 400 });

    // If document changed, ensure uniqueness
    if (document) {
      const dup = await sql`SELECT id FROM customers WHERE document = ${document} AND id <> ${id}`;
      if (dup.length > 0) return NextResponse.json({ success: false, message: 'Document already used' }, { status: 409 });
    }


    // Audit
    await sql`
      INSERT INTO audit_logs (entity_type, entity_id, action, user_id, details)
      VALUES ('customer', ${id}, 'update', ${userId || null}, ${JSON.stringify({ name, document, phone, email })})
    `;

    // Notification
    await createNotification('cliente', `Cliente actualizado: ${name}`, { customerId: id });

    return NextResponse.json({ success: true, message: 'Customer updated' });
  } catch (err) {
    console.error('[CUSTOMERS PUT Error]', err);
    return NextResponse.json({ success: false, message: 'Error updating customer' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const allowed = apiLimiter.check(`customers:delete:${ip}`);
    if (!allowed.allowed) return NextResponse.json({ success: false, message: 'Rate limit exceeded' }, { status: 429 });

    const id = Number(params.id);
    if (!id) return NextResponse.json({ success: false, message: 'Customer id required' }, { status: 400 });

    await sql`UPDATE customers SET active = false, updated_at = NOW() WHERE id = ${id}`;

    // Audit
    await sql`INSERT INTO audit_logs (entity_type, entity_id, action) VALUES ('customer', ${id}, 'delete')`;

    return NextResponse.json({ success: true, message: 'Customer deactivated' });
  } catch (err) {
    console.error('[CUSTOMERS DELETE Error]', err);
    return NextResponse.json({ success: false, message: 'Error deleting customer' }, { status: 500 });
  }
}
