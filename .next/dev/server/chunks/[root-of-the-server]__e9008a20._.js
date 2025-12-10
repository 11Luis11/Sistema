module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/lib/database.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Neon database connection
__turbopack_context__.s([
    "sql",
    ()=>sql
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@neondatabase/serverless/index.mjs [app-route] (ecmascript)");
;
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}
const sql = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$neondatabase$2f$serverless$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["neon"])(process.env.DATABASE_URL);
;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/lib/security/rate-limit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiLimiter",
    ()=>apiLimiter,
    "loginLimiter",
    ()=>loginLimiter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$cache$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/node-cache/index.js [app-route] (ecmascript)");
;
const DEFAULT_CONFIG = {
    windowMs: 60 * 1000,
    maxRequests: 30
};
class RateLimiter {
    cache = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$cache$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]({
        stdTTL: 60,
        checkperiod: 30
    });
    config;
    constructor(config = {}){
        this.config = {
            ...DEFAULT_CONFIG,
            ...config
        };
    }
    check(identifier) {
        const key = `ratelimit:${identifier}`;
        let count = this.cache.get(key) || 0;
        if (count >= this.config.maxRequests) {
            return {
                allowed: false,
                remaining: 0
            };
        }
        count += 1;
        this.cache.set(key, count, Math.ceil(this.config.windowMs / 1000));
        return {
            allowed: true,
            remaining: this.config.maxRequests - count
        };
    }
    reset(identifier) {
        this.cache.del(`ratelimit:${identifier}`);
    }
}
const apiLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 100
});
const loginLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 10
});
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/suppliers/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/database.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/rate-limit.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
function getRoleFromRequest(request) {
    return request.headers.get('X-User-Role') || null;
}
async function GET(request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimitCheck = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiLimiter"].check(`suppliers:get:${ip}`);
        if (!rateLimitCheck.allowed) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Rate limit exceeded'
            }, {
                status: 429
            });
        }
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const limit = parseInt(searchParams.get('limit') || '100');
        const searchPattern = `%${search}%`;
        const suppliers = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            suppliers
        });
    } catch (error) {
        console.error('[Suppliers GET Error]', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Error fetching suppliers'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimitCheck = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiLimiter"].check(`suppliers:post:${ip}`);
        if (!rateLimitCheck.allowed) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Rate limit exceeded'
            }, {
                status: 429
            });
        }
        const role = getRoleFromRequest(request);
        if (![
            'Administrator',
            'Manager'
        ].includes(role || '')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Unauthorized'
            }, {
                status: 403
            });
        }
        const body = await request.json();
        const { code, name, contactName, email, phone, address, city, country, taxId, notes } = body;
        if (!code || !name) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Code and name are required'
            }, {
                status: 400
            });
        }
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      SELECT id FROM suppliers WHERE UPPER(code) = UPPER(${code})
    `;
        if (existing.length > 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Supplier code already exists'
            }, {
                status: 409
            });
        }
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO suppliers (code, name, contact_name, email, phone, address, city, country, tax_id, notes, active)
      VALUES (${code}, ${name}, ${contactName || null}, ${email || null}, ${phone || null}, 
              ${address || null}, ${city || null}, ${country || 'Perú'}, ${taxId || null}, ${notes || null}, true)
      RETURNING *
    `;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Supplier created successfully',
            supplier: result[0]
        }, {
            status: 201
        });
    } catch (error) {
        console.error('[Suppliers POST Error]', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Error creating supplier'
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimitCheck = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiLimiter"].check(`suppliers:delete:${ip}`);
        if (!rateLimitCheck.allowed) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Rate limit exceeded'
            }, {
                status: 429
            });
        }
        const role = getRoleFromRequest(request);
        if (![
            'Administrator',
            'Manager'
        ].includes(role || '')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Unauthorized'
            }, {
                status: 403
            });
        }
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Supplier ID required'
            }, {
                status: 400
            });
        }
        // Soft delete
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      UPDATE suppliers
      SET active = false, updated_at = NOW()
      WHERE id = ${parseInt(id)} AND active = true
      RETURNING id, name
    `;
        if (result.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Supplier not found'
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Supplier deleted successfully'
        });
    } catch (error) {
        console.error('[Suppliers DELETE Error]', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Error deleting supplier'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e9008a20._.js.map