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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
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
"[project]/lib/notifications.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/notifications.ts
__turbopack_context__.s([
    "createNotification",
    ()=>createNotification
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/database.ts [app-route] (ecmascript)");
;
async function createNotification(type, message, meta = {}) {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO notifications (type, message, meta, read)
      VALUES (${type}, ${message}, ${JSON.stringify(meta)}, false)
    `;
    } catch (err) {
        console.error('[createNotification Error]', err);
    }
}
}),
"[project]/app/api/customers/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/database.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/rate-limit.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/notifications.ts [app-route] (ecmascript)");
;
;
;
;
async function PUT(request, { params }) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const allowed = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiLimiter"].check(`customers:put:${ip}`);
        if (!allowed.allowed) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Rate limit exceeded'
        }, {
            status: 429
        });
        const { id: idParam } = await params; // Await params aquí
        const id = Number(idParam);
        const body = await request.json();
        const { name, document, phone, email, userId } = body;
        if (!id) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Customer id required'
        }, {
            status: 400
        });
        // If document changed, ensure uniqueness
        if (document) {
            const dup = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`SELECT id FROM customers WHERE document = ${document} AND id <> ${id}`;
            if (dup.length > 0) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Document already used'
            }, {
                status: 409
            });
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      UPDATE customers SET name=${name}, document=${document}, phone=${phone}, email=${email}, updated_at=NOW()
      WHERE id=${id}
    `;
        // Audit
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      INSERT INTO audit_logs (entity_type, entity_id, action, user_id, details)
      VALUES ('customer', ${id}, 'update', ${userId || null}, ${JSON.stringify({
            name,
            document,
            phone,
            email
        })})
    `;
        // Notification
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$notifications$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createNotification"])('cliente', `Cliente actualizado: ${name}`, {
            customerId: id
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Customer updated'
        });
    } catch (err) {
        console.error('[CUSTOMERS PUT Error]', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Error updating customer'
        }, {
            status: 500
        });
    }
}
async function DELETE(request, { params }) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const allowed = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiLimiter"].check(`customers:delete:${ip}`);
        if (!allowed.allowed) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Rate limit exceeded'
        }, {
            status: 429
        });
        const { id: idParam } = await params; // Await params aquí
        const id = Number(idParam);
        if (!id) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Customer id required'
        }, {
            status: 400
        });
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`UPDATE customers SET active = false, updated_at = NOW() WHERE id = ${id}`;
        // Audit
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`INSERT INTO audit_logs (entity_type, entity_id, action) VALUES ('customer', ${id}, 'delete')`;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Customer deactivated'
        });
    } catch (err) {
        console.error('[CUSTOMERS DELETE Error]', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Error deleting customer'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4fb2c561._.js.map