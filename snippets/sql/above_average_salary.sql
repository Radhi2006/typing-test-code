-- @codetype medium | Correlated subquery against the department average
SELECT e.name, e.salary, e.department_id
FROM employees AS e
WHERE e.salary > (
  SELECT AVG(inner_e.salary)
  FROM employees AS inner_e
  WHERE inner_e.department_id = e.department_id
)
ORDER BY e.department_id, e.salary DESC;
