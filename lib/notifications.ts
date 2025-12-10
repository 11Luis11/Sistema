// lib/notifications.ts
import { sql } from '@/lib/database';

export async function createNotification(type: string, message: string, meta: any = {}) {
  try {
    await sql`
      INSERT INTO notifications (type, message, meta, read)
      VALUES (${type}, ${message}, ${JSON.stringify(meta)}, false)
    `;
  } catch (err) {
    console.error('[createNotification Error]', err);
  }
}
