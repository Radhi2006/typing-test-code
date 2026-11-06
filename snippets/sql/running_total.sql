-- @codetype hard | Daily revenue with a running total window
SELECT
  day,
  revenue,
  SUM(revenue) OVER (ORDER BY day) AS running_total,
  AVG(revenue) OVER (
    ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7d
FROM (
  SELECT DATE(created_at) AS day, SUM(total) AS revenue
  FROM orders
  WHERE status = 'paid'
  GROUP BY DATE(created_at)
) AS daily
ORDER BY day;
