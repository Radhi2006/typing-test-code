-- @codetype medium | Insert or update stock with ON CONFLICT
INSERT INTO products (sku, name, stock, price)
VALUES
  ('KB-001', 'Mechanical Keyboard', 25, 89.90),
  ('MS-002', 'Wireless Mouse', 40, 24.50)
ON CONFLICT (sku) DO UPDATE SET
  stock = products.stock + excluded.stock,
  price = excluded.price;
