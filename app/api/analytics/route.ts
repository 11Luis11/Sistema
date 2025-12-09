import { sql } from '@/lib/database';
import { apiLimiter } from '@/lib/security/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitCheck = apiLimiter.check(`analytics:get:${ip}`);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { success: false, message: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get('period') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    const startDateString = startDate.toISOString();

    console.log('[Analytics] Period:', period, 'Start Date:', startDateString);

    // 1. Estadísticas de productos
    const totalProducts = await sql`
      SELECT COUNT(*) as count FROM products WHERE active = true
    `;

    const lowStock = await sql`
      SELECT COUNT(*) as count FROM products WHERE active = true AND current_stock < 10
    `;

    const totalValue = await sql`
      SELECT COALESCE(SUM(price * current_stock), 0) as total
      FROM products WHERE active = true
    `;

    // 2. Estadísticas de ventas
    const salesStats = await sql`
      SELECT 
        COUNT(*) as total_sales,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(AVG(total_amount), 0) as average_sale
      FROM sales
      WHERE created_at >= ${startDateString}
    `;

    console.log('[Analytics] Sales Stats:', salesStats[0]);

    // 3. Ventas por día (últimos 7 días)
    const salesByDay = await sql`
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
    const topSellingProducts = await sql`
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
