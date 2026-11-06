-- @codetype medium | Aggregate spending per customer with HAVING
SELECT
  c.id,
  c.name,
  COUNT(o.id) AS orders,
  SUM(o.total) AS lifetime_value,
  ROUND(AVG(o.total), 2) AS avg_order
FROM customers AS c
JOIN orders AS o ON o.customer_id = c.id
WHERE o.status <> 'cancelled'
GROUP BY c.id, c.name
HAVING SUM(o.total) > 1000
ORDER BY lifetime_value DESC;
