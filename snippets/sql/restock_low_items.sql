-- @codetype medium | Update rows selected by a subquery
UPDATE products
SET stock = stock + 50,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (
  SELECT p.id
  FROM products AS p
  WHERE p.stock < 10
    AND p.discontinued = 0
);
