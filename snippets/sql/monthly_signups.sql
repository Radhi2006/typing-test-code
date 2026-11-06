-- @codetype medium | Count signups per month
SELECT
  strftime('%Y-%m', created_at) AS month,
  COUNT(*) AS signups,
  SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS admins
FROM users
GROUP BY month
ORDER BY month;
