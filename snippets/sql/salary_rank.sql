-- @codetype hard | Rank employees by salary inside each department
SELECT
  d.name AS department,
  e.name AS employee,
  e.salary,
  RANK() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) AS pay_rank,
  e.salary - AVG(e.salary) OVER (PARTITION BY e.department_id) AS diff_from_avg
FROM employees AS e
JOIN departments AS d ON d.id = e.department_id
ORDER BY department, pay_rank;
