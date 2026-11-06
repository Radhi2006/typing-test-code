// @codetype hard | Breadth-first distances in an unweighted graph
#include <iostream>
#include <queue>
#include <vector>

std::vector<int> bfs(const std::vector<std::vector<int>>& adj, int start) {
    std::vector<int> dist(adj.size(), -1);
    std::queue<int> q;
    dist[start] = 0;
    q.push(start);

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        for (int v : adj[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
    return dist;
}

int main() {
    std::vector<std::vector<int>> adj{{1, 2}, {0, 3}, {0, 3}, {1, 2, 4}, {3}};
    for (int d : bfs(adj, 0)) std::cout << d << ' ';
    std::cout << '\n';
}
