// @codetype hard | Breadth-first search on a 2D grid with Queue
using System.Collections.Generic;

public static class GridPathfinder
{
    private static readonly (int dr, int dc)[] Directions =
        { (1, 0), (-1, 0), (0, 1), (0, -1) };

    public static int ShortestPath(
        char[,] grid, (int r, int c) start, (int r, int c) goal)
    {
        int rows = grid.GetLength(0), cols = grid.GetLength(1);
        var seen = new HashSet<(int, int)> { start };
        var queue = new Queue<((int r, int c) pos, int steps)>();
        queue.Enqueue((start, 0));

        while (queue.Count > 0)
        {
            var (pos, steps) = queue.Dequeue();
            if (pos == goal) return steps;
            foreach (var (dr, dc) in Directions)
            {
                var next = (r: pos.r + dr, c: pos.c + dc);
                bool inside = next.r >= 0 && next.c >= 0
                    && next.r < rows && next.c < cols;
                if (!inside) continue;
                if (grid[next.r, next.c] == '#' || !seen.Add(next)) continue;
                queue.Enqueue((next, steps + 1));
            }
        }
        return -1;
    }
}
