-- @codetype easy | Categorize rows with CASE WHEN
SELECT
  id,
  total,
  CASE
    WHEN total >= 500 THEN 'large'
    WHEN total >= 100 THEN 'medium'
    ELSE 'small'
  END AS size_bucket
FROM orders
ORDER BY total DESC;
