-- @codetype easy | Find customers who never ordered with a LEFT JOIN
SELECT c.id, c.name, c.email
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
WHERE o.id IS NULL
ORDER BY c.name;
