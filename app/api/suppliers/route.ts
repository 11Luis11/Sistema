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

export async function POST(request: NextRequest) {
try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitCheck = apiLimiter.check(`suppliers:post:${ip}`);

    if (!rateLimitCheck.allowed) {
            return NextResponse.json(
        { success: false, message: 'Rate limit exceeded' },
        { status: 429 }
    );
    }

    const role = getRoleFromRequest(request);

    if (!['Administrator', 'Manager'].includes(role || '')) {
    return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
    );
    }

    const body = await request.json();
    const { code, name, contactName, email, phone, address, city, country, taxId, notes } = body;

    if (!code || !name) {
    return NextResponse.json(
        { success: false, message: 'Code and name are required' },
        { status: 400 }
    );
    }

    const existing = await sql`
    SELECT id FROM suppliers WHERE UPPER(code) = UPPER(${code})
    `;

    if (existing.length > 0) {
    return NextResponse.json(
        { success: false, message: 'Supplier code already exists' },
        { status: 409 }
    );
    }

    const result = await sql`
    INSERT INTO suppliers (code, name, contact_name, email, phone, address, city, country, tax_id, notes, active)
    VALUES (${code}, ${name}, ${contactName || null}, ${email || null}, ${phone || null}, 
            ${address || null}, ${city || null}, ${country || 'Perú'}, ${taxId || null}, ${notes || null}, true)
      RETURNING *
    `;

    return NextResponse.json(
    { success: true, message: 'Supplier created successfully', supplier: result[0] },
    { status: 201 }
    );
    } catch (error) {
    console.error('[Suppliers POST Error]', error);
    return NextResponse.json(
    { success: false, message: 'Error creating supplier' },
    { status: 500 }
    );
    }
}

export async function DELETE(request: NextRequest) {
try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitCheck = apiLimiter.check(`suppliers:delete:${ip}`);

    if (!rateLimitCheck.allowed) {
    return NextResponse.json(
        { success: false, message: 'Rate limit exceeded' },
        { status: 429 }
    );
    }

    const role = getRoleFromRequest(request);

    if (!['Administrator', 'Manager'].includes(role || '')) {
    return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
    );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
    return NextResponse.json(
        { success: false, message: 'Supplier ID required' },
        { status: 400 }
    );
    }

    const result = await sql`
    UPDATE suppliers
    SET active = false, updated_at = NOW()
    WHERE id = ${parseInt(id)} AND active = true
    RETURNING id, name
    `;

    if (result.length === 0) {
    return NextResponse.json(
        { success: false, message: 'Supplier not found' },
        { status: 404 }
    );
    }

    return NextResponse.json({
    success: true,
    message: 'Supplier deleted successfully'
    });
    } catch (error) {
    console.error('[Suppliers DELETE Error]', error);
    return NextResponse.json(
    { success: false, message: 'Error deleting supplier' },
    { status: 500 }
    );
    }
}