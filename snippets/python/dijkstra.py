# @codetype hard | Dijkstra's shortest paths using a heap
import heapq


def dijkstra(graph: dict[str, dict[str, int]], source: str) -> dict[str, int]:
    dist = {node: float("inf") for node in graph}
    dist[source] = 0
    heap = [(0, source)]

    while heap:
        d, node = heapq.heappop(heap)
        if d > dist[node]:
            continue
        for neighbor, weight in graph[node].items():
            candidate = d + weight
            if candidate < dist[neighbor]:
                dist[neighbor] = candidate
                heapq.heappush(heap, (candidate, neighbor))
    return dist


roads = {"A": {"B": 4, "C": 1}, "B": {"D": 1}, "C": {"B": 2}, "D": {}}
print(dijkstra(roads, "A"))
