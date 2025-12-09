const sales = await sql`
  SELECT 
    s.id,
    s.sale_code,
    s.customer_name,
    s.customer_email,
    s.customer_phone,
    s.total_amount,
    s.payment_method,
    s.status,
    s.created_at,
    CONCAT(u.first_name, ' ', u.last_name) as user_name,
    COUNT(si.id) as items_count
  FROM sales s
  JOIN users u ON s.user_id = u.id
  LEFT JOIN sale_items si ON s.id = si.sale_id
  WHERE s.created_at >= ${startDate.toISOString()}
  GROUP BY s.id, u.first_name, u.last_name
  ORDER BY s.created_at DESC
  LIMIT ${limit}
`;

return NextResponse.json({ success: true, sales });
