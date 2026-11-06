// @codetype hard | Shortest path distances with Dijkstra's algorithm
type Graph = Record<string, Record<string, number>>;

export function dijkstra(graph: Graph, start: string): Record<string, number> {
  const dist: Record<string, number> = {};
  const visited = new Set<string>();
  for (const node of Object.keys(graph)) dist[node] = Infinity;
  dist[start] = 0;

  while (visited.size < Object.keys(graph).length) {
    let current: string | null = null;
    for (const node of Object.keys(dist)) {
      if (visited.has(node)) continue;
      if (current === null || dist[node] < dist[current]) current = node;
    }
    if (current === null || dist[current] === Infinity) break;
    visited.add(current);

    for (const [next, weight] of Object.entries(graph[current])) {
      const candidate = dist[current] + weight;
      if (candidate < dist[next]) dist[next] = candidate;
    }
  }
  return dist;
}
