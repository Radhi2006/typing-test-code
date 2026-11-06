-- @codetype easy | Join orders with their customers
SELECT
  o.id AS order_id,
  c.name AS customer,
  o.total,
  o.created_at
FROM orders AS o
JOIN customers AS c ON c.id = o.customer_id
WHERE o.status = 'paid'
ORDER BY o.created_at DESC
LIMIT 20;
