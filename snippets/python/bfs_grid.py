# @codetype hard | Shortest path in a grid with breadth-first search
from collections import deque


def shortest_path(grid: list[str], start, goal) -> int:
    rows, cols = len(grid), len(grid[0])
    queue = deque([(start, 0)])
    seen = {start}

    while queue:
        (r, c), steps = queue.popleft()
        if (r, c) == goal:
            return steps
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            if grid[nr][nc] == "#" or (nr, nc) in seen:
                continue
            seen.add((nr, nc))
            queue.append(((nr, nc), steps + 1))
    return -1


maze = ["..#.", "..#.", "....", "#.#."]
print(shortest_path(maze, (0, 0), (0, 3)))
