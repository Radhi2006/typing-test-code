// @codetype hard | Breadth-first traversal of an adjacency map
fun bfs(graph: Map<String, List<String>>, start: String): List<String> {
    val visited = linkedSetOf(start)
    val queue = ArrayDeque(listOf(start))

    while (queue.isNotEmpty()) {
        val node = queue.removeFirst()
        for (next in graph[node].orEmpty()) {
            if (visited.add(next)) queue.addLast(next)
        }
    }
    return visited.toList()
}

fun main() {
    val graph = mapOf(
        "home" to listOf("about", "blog"),
        "blog" to listOf("post-1", "post-2"),
        "about" to listOf("contact"),
        "post-1" to listOf("home"),
    )
    println(bfs(graph, "home"))
}
