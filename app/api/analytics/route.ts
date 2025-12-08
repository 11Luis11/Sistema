const salesStats = await sql`
  SELECT 
    COUNT(*) as total_sales,
    COALESCE(SUM(total_amount), 0) as total_revenue,
    COALESCE(AVG(total_amount), 0) as average_sale
  FROM sales
  WHERE created_at >= ${startDateString}
`;
totalSales: parseInt(salesStats[0]?.total_sales || '0'),
totalRevenue: parseFloat(salesStats[0]?.total_revenue || '0'),
