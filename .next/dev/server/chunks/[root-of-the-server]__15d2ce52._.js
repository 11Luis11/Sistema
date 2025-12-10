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
"[project]/app/api/analytics/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/database.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/security/rate-limit.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimitCheck = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$security$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiLimiter"].check(`analytics:get:${ip}`);
        if (!rateLimitCheck.allowed) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'Rate limit exceeded'
            }, {
                status: 429
            });
        }
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: 'No autorizado'
            }, {
                status: 401
            });
        }
        const { searchParams } = new URL(request.url);
        const period = parseInt(searchParams.get('period') || '30');
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - period);
        const startDateString = startDate.toISOString();
        console.log('[Analytics] Period:', period, 'Start Date:', startDateString);
        // 1. Estadísticas de productos
        const totalProducts = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      SELECT COUNT(*) as count FROM products WHERE active = true
    `;
        const lowStock = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      SELECT COUNT(*) as count FROM products WHERE active = true AND current_stock < 10
    `;
        const totalValue = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      SELECT COALESCE(SUM(price * current_stock), 0) as total
      FROM products WHERE active = true
    `;
        // 2. Estadísticas de ventas
        const salesStats = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      SELECT 
        COUNT(*) as total_sales,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(AVG(total_amount), 0) as average_sale
      FROM sales
      WHERE created_at >= ${startDateString}
    `;
        console.log('[Analytics] Sales Stats:', salesStats[0]);
        // 3. Ventas por día (últimos 7 días)
        const salesByDay = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as sales_count,
        COALESCE(SUM(total_amount), 0) as revenue
      FROM sales
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
        console.log('[Analytics] Sales by Day:', salesByDay);
        // 4. Top 5 productos más vendidos
        const topSellingProducts = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      SELECT 
        si.product_name,
        si.product_code,
        SUM(si.quantity) as total_sold,
        COALESCE(SUM(si.subtotal), 0) as total_revenue,
        COUNT(DISTINCT si.sale_id) as sales_count
      FROM sale_items si
      JOIN sales s ON si.sale_id = s.id
      WHERE s.created_at >= ${startDateString}
      GROUP BY si.product_id, si.product_name, si.product_code
      ORDER BY total_sold DESC
      LIMIT 5
    `;
        console.log('[Analytics] Top Products:', topSellingProducts);
        // 5. Ventas por método de pago
        const salesByPaymentMethod = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      SELECT 
        COALESCE(payment_method, 'No especificado') as payment_method,
        COUNT(*) as count,
        COALESCE(SUM(total_amount), 0) as total
      FROM sales
      WHERE created_at >= ${startDateString}
      GROUP BY payment_method
      ORDER BY total DESC
    `;
        console.log('[Analytics] Payment Methods:', salesByPaymentMethod);
        // 6. Productos por categoría
        const productsByCategory = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      SELECT 
        c.name as category,
        COUNT(p.id) as count,
        COALESCE(SUM(p.current_stock), 0) as total_stock
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.active = true
      GROUP BY c.id, c.name
      ORDER BY count DESC
    `;
        // 7. Proveedores activos
        const suppliersStats = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$database$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
      SELECT 
        COUNT(*) as total_suppliers,
        COUNT(DISTINCT ps.supplier_id) as active_suppliers
      FROM suppliers s
      LEFT JOIN product_suppliers ps ON s.id = ps.supplier_id
      WHERE s.active = true
    `;
        const response = {
            success: true,
            analytics: {
                summary: {
                    totalProducts: parseInt(totalProducts[0]?.count || '0'),
                    lowStockProducts: parseInt(lowStock[0]?.count || '0'),
                    totalInventoryValue: parseFloat(totalValue[0]?.total || '0'),
                    totalSales: parseInt(salesStats[0]?.total_sales || '0'),
                    totalRevenue: parseFloat(salesStats[0]?.total_revenue || '0'),
                    averageSale: parseFloat(salesStats[0]?.average_sale || '0'),
                    totalSuppliers: parseInt(suppliersStats[0]?.total_suppliers || '0'),
                    activeSuppliers: parseInt(suppliersStats[0]?.active_suppliers || '0')
                },
                sales: {
                    byDay: salesByDay.map((row)=>({
                            date: row.date,
                            sales_count: parseInt(row.sales_count || '0'),
                            revenue: parseFloat(row.revenue || '0')
                        })),
                    byPaymentMethod: salesByPaymentMethod.map((row)=>({
                            payment_method: row.payment_method,
                            count: parseInt(row.count || '0'),
                            total: parseFloat(row.total || '0')
                        })),
                    topProducts: topSellingProducts.map((row)=>({
                            product_name: row.product_name,
                            product_code: row.product_code,
                            total_sold: parseInt(row.total_sold || '0'),
                            total_revenue: parseFloat(row.total_revenue || '0'),
                            sales_count: parseInt(row.sales_count || '0')
                        }))
                },
                products: {
                    byCategory: productsByCategory.map((row)=>({
                            category: row.category,
                            count: parseInt(row.count || '0'),
                            total_stock: parseInt(row.total_stock || '0')
                        }))
                },
                period: period
            }
        };
        console.log('[Analytics] Final Response Summary:', {
            totalSales: response.analytics.summary.totalSales,
            totalRevenue: response.analytics.summary.totalRevenue,
            topProductsCount: response.analytics.sales.topProducts.length,
            paymentMethodsCount: response.analytics.sales.byPaymentMethod.length
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response);
    } catch (error) {
        console.error('[Analytics GET Error]', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: 'Error al obtener analytics',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__15d2ce52._.js.map