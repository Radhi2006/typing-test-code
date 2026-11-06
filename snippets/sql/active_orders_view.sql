-- @codetype medium | Create an index and a reporting view
CREATE INDEX IF NOT EXISTS idx_orders_customer_status
  ON orders (customer_id, status);

CREATE VIEW IF NOT EXISTS active_orders AS
SELECT
  o.id,
  c.name AS customer,
  o.total,
  o.status
FROM orders AS o
JOIN customers AS c ON c.id = o.customer_id
WHERE o.status IN ('pending', 'paid');
