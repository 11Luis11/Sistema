// app/api/customers/route.ts
import { sql } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';
import { apiLimiter } from '@/lib/security/rate-limit';
import { createNotification } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const allowed = apiLimiter.check(`customers:get:${ip}`);
    if (!allowed.allowed) return NextResponse.json({ success: false, message: 'Rate limit exceeded' }, { status: 429 });

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

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const allowed = apiLimiter.check(`customers:post:${ip}`);
    if (!allowed.allowed) return NextResponse.json({ success: false, message: 'Rate limit exceeded' }, { status: 429 });

    const body = await request.json();
    const { name, document, phone, email, userId } = body;

    if (!name || !document || !email) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    // Check duplicate document
    const existing = await sql`SELECT id FROM customers WHERE document = ${document}`;
    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: 'Document already exists' }, { status: 409 });
    }

    const res = await sql`
      INSERT INTO customers (name, document, phone, email)
      VALUES (${name}, ${document}, ${phone}, ${email})
      RETURNING id, name, document, phone, email, created_at
    `;

    const newCustomer = res[0];

    // Audit log
    await sql`
      INSERT INTO audit_logs (entity_type, entity_id, action, user_id, details)
      VALUES ('customer', ${newCustomer.id}, 'create', ${userId || null}, ${JSON.stringify({ name, document, phone, email })})
    `;

    // Create notification for new customer
    try {
      await createNotification('cliente', `Nuevo cliente: ${newCustomer.name}`, { customerId: newCustomer.id });
    } catch (notiErr) {
      console.error('[Notification Error]', notiErr);
    }

    return NextResponse.json({ success: true, customer: newCustomer }, { status: 201 });
  } catch (err) {
    console.error('[CUSTOMERS POST Error]', err);
    return NextResponse.json({ success: false, message: 'Error creating customer' }, { status: 500 });
  }
}