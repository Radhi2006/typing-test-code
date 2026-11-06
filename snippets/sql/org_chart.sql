-- @codetype hard | Walk a reporting hierarchy with a recursive CTE
WITH RECURSIVE chain AS (
  SELECT id, name, manager_id, 0 AS depth, name AS path
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  SELECT e.id, e.name, e.manager_id, c.depth + 1, c.path || ' > ' || e.name
  FROM employees AS e
  JOIN chain AS c ON e.manager_id = c.id
)
SELECT depth, name, path
FROM chain
ORDER BY path;
