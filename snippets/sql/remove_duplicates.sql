-- @codetype medium | Delete duplicate emails but keep the oldest row
DELETE FROM customers
WHERE id NOT IN (
  SELECT MIN(id)
  FROM customers
  GROUP BY LOWER(email)
);
