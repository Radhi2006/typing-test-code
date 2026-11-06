-- @codetype hard | Top 3 products per category with ROW_NUMBER
WITH ranked AS (
  SELECT
    p.category,
    p.name,
    SUM(oi.quantity) AS units_sold,
    ROW_NUMBER() OVER (
      PARTITION BY p.category
      ORDER BY SUM(oi.quantity) DESC
    ) AS rn
  FROM order_items AS oi
  JOIN products AS p ON p.id = oi.product_id
  GROUP BY p.category, p.name
)
SELECT category, name, units_sold
FROM ranked
WHERE rn <= 3
ORDER BY category, units_sold DESC;
