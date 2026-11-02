import { CodeSnippet } from '../../types/snippet';

const snippets: CodeSnippet[] = [
  {
    id: 'sql-001',
    language: 'sql',
    title: 'Basic SELECT',
    description: 'Select with WHERE and ORDER BY',
    code: `SELECT name, email, created_at
FROM users
WHERE active = true
ORDER BY created_at DESC;`,
    difficulty: 'easy',
    tags: ['select', 'where', 'order-by'],
  },
  {
    id: 'sql-002',
    language: 'sql',
    title: 'INNER JOIN',
    description: 'Join orders with customers',
    code: `SELECT o.id, c.name, o.total, o.order_date
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
WHERE o.total > 100;`,
    difficulty: 'easy',
    tags: ['join', 'inner-join'],
  },
  {
    id: 'sql-003',
    language: 'sql',
    title: 'GROUP BY with HAVING',
    description: 'Count orders per customer with minimum threshold',
    code: `SELECT customer_id, COUNT(*) AS order_count, SUM(total) AS total_spent
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 5
ORDER BY total_spent DESC;`,
    difficulty: 'easy',
    tags: ['group-by', 'having', 'aggregation'],
  },
  {
    id: 'sql-004',
    language: 'sql',
    title: 'Create Index',
    description: 'Create indexes for common queries',
    code: `CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_orders_customer_date
  ON orders (customer_id, order_date DESC);`,
    difficulty: 'easy',
    tags: ['indexes', 'performance'],
  },
  {
    id: 'sql-005',
    language: 'sql',
    title: 'Subquery Filter',
    description: 'Find customers who placed orders above average',
    code: `SELECT name, email
FROM customers
WHERE id IN (
  SELECT DISTINCT customer_id
  FROM orders
  WHERE total > (
    SELECT AVG(total) FROM orders
  )
);`,
    difficulty: 'medium',
    tags: ['subqueries', 'nested'],
  },
  {
    id: 'sql-006',
    language: 'sql',
    title: 'Window Function Rank',
    description: 'Rank employees by salary within departments',
    code: `SELECT
  name,
  department,
  salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS overall_rank
FROM employees;`,
    difficulty: 'medium',
    tags: ['window-functions', 'rank'],
  },
  {
    id: 'sql-007',
    language: 'sql',
    title: 'Common Table Expression',
    description: 'CTE to calculate monthly revenue',
    code: `WITH monthly_revenue AS (
  SELECT
    DATE_TRUNC('month', order_date) AS month,
    SUM(total) AS revenue
  FROM orders
  GROUP BY DATE_TRUNC('month', order_date)
)
SELECT
  month,
  revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_month,
  revenue - LAG(revenue) OVER (ORDER BY month) AS growth
FROM monthly_revenue
ORDER BY month;`,
    difficulty: 'medium',
    tags: ['cte', 'window-functions', 'analytics'],
  },
  {
    id: 'sql-008',
    language: 'sql',
    title: 'UPSERT Statement',
    description: 'Insert or update on conflict',
    code: `INSERT INTO products (sku, name, price, stock)
VALUES ('ABC123', 'Widget', 29.99, 100)
ON CONFLICT (sku)
DO UPDATE SET
  price = EXCLUDED.price,
  stock = products.stock + EXCLUDED.stock,
  updated_at = NOW();`,
    difficulty: 'medium',
    tags: ['upsert', 'insert', 'conflict'],
  },
  {
    id: 'sql-009',
    language: 'sql',
    title: 'Trigger Function',
    description: 'Trigger to update timestamp on row change',
    code: `CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();`,
    difficulty: 'hard',
    tags: ['triggers', 'functions', 'plpgsql'],
  },
  {
    id: 'sql-010',
    language: 'sql',
    title: 'Stored Procedure',
    description: 'Procedure to transfer funds between accounts',
    code: `CREATE OR REPLACE PROCEDURE transfer_funds(
  sender_id INT,
  receiver_id INT,
  amount DECIMAL(10, 2)
)
LANGUAGE plpgsql AS $$
BEGIN
  IF amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  UPDATE accounts SET balance = balance - amount
  WHERE id = sender_id AND balance >= amount;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;

  UPDATE accounts SET balance = balance + amount
  WHERE id = receiver_id;

  COMMIT;
END;
$$;`,
    difficulty: 'hard',
    tags: ['stored-procedures', 'transactions'],
  },
  {
    id: 'sql-011',
    language: 'sql',
    title: 'Pivot Query',
    description: 'Pivot sales data by quarter using CASE',
    code: `SELECT
  product_name,
  SUM(CASE WHEN quarter = 1 THEN revenue ELSE 0 END) AS q1,
  SUM(CASE WHEN quarter = 2 THEN revenue ELSE 0 END) AS q2,
  SUM(CASE WHEN quarter = 3 THEN revenue ELSE 0 END) AS q3,
  SUM(CASE WHEN quarter = 4 THEN revenue ELSE 0 END) AS q4,
  SUM(revenue) AS total
FROM (
  SELECT product_name, EXTRACT(QUARTER FROM sale_date) AS quarter, amount AS revenue
  FROM sales
) sub
GROUP BY product_name
ORDER BY total DESC;`,
    difficulty: 'hard',
    tags: ['pivot', 'case', 'aggregation'],
  },
  {
    id: 'sql-012',
    language: 'sql',
    title: 'Recursive CTE',
    description: 'Recursive query to traverse an org hierarchy',
    code: `WITH RECURSIVE org_tree AS (
  SELECT id, name, manager_id, 1 AS depth
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  SELECT e.id, e.name, e.manager_id, t.depth + 1
  FROM employees e
  INNER JOIN org_tree t ON e.manager_id = t.id
)
SELECT
  id,
  name,
  depth,
  REPEAT('  ', depth - 1) || name AS hierarchy
FROM org_tree
ORDER BY depth, name;`,
    difficulty: 'hard',
    tags: ['recursive', 'cte', 'hierarchy'],
  },
];

export default snippets;
