module.exports = [
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
];

//# sourceMappingURL=lib_notifications_ts_3395db0e._.js.map