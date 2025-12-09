import { sql } from '@/lib/database';
import { apiLimiter } from '@/lib/security/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

function getRoleFromRequest(request: NextRequest): string | null {
  return request.headers.get('X-User-Role') || null;
}

