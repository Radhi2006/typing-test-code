// @codetype hard | Breadth-first search over an adjacency list
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

public class GraphBfs {
    private final Map<String, List<String>> edges = new HashMap<>();

    public void addEdge(String from, String to) {
        edges.computeIfAbsent(from, k -> new ArrayList<>()).add(to);
        edges.computeIfAbsent(to, k -> new ArrayList<>()).add(from);
    }

    public List<String> bfs(String start) {
        List<String> order = new ArrayList<>();
        Set<String> seen = new HashSet<>(List.of(start));
        Queue<String> queue = new ArrayDeque<>(List.of(start));
        while (!queue.isEmpty()) {
            String node = queue.poll();
            order.add(node);
            for (String next : edges.getOrDefault(node, List.of())) {
                if (seen.add(next)) queue.add(next);
            }
        }
        return order;
    }
}
