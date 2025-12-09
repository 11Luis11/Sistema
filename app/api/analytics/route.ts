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

    // 5. Ventas por método de pago
    const salesByPaymentMethod = await sql`
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
    const productsByCategory = await sql`
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
    const suppliersStats = await sql`
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
          activeSuppliers: parseInt(suppliersStats[0]?.active_suppliers || '0'),
        },
        sales: {
          byDay: salesByDay.map(row => ({
            date: row.date,
            sales_count: parseInt(row.sales_count || '0'),
            revenue: parseFloat(row.revenue || '0')
          })),
          byPaymentMethod: salesByPaymentMethod.map(row => ({
            payment_method: row.payment_method,
            count: parseInt(row.count || '0'),
            total: parseFloat(row.total || '0')
          })),
          topProducts: topSellingProducts.map(row => ({
            product_name: row.product_name,
            product_code: row.product_code,
            total_sold: parseInt(row.total_sold || '0'),
            total_revenue: parseFloat(row.total_revenue || '0'),
            sales_count: parseInt(row.sales_count || '0')
          }))
        },
        products: {
          byCategory: productsByCategory.map(row => ({
            category: row.category,
            count: parseInt(row.count || '0'),
            total_stock: parseInt(row.total_stock || '0')
          }))
        },
        period: period,
      }
    };

    console.log('[Analytics] Final Response Summary:', {
      totalSales: response.analytics.summary.totalSales,
      totalRevenue: response.analytics.summary.totalRevenue,
      topProductsCount: response.analytics.sales.topProducts.length,
      paymentMethodsCount: response.analytics.sales.byPaymentMethod.length
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('[Analytics GET Error]', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al obtener analytics',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}