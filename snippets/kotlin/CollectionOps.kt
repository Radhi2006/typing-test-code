// @codetype medium | groupBy, mapValues and sorting collections
data class Order(val customer: String, val total: Double, val paid: Boolean)

fun main() {
    val orders = listOf(
        Order("Ana", 120.0, true),
        Order("Budi", 75.5, false),
        Order("Ana", 60.0, true),
        Order("Cici", 210.0, true),
    )

    val revenue = orders
        .filter { it.paid }
        .groupBy { it.customer }
        .mapValues { (_, list) -> list.sumOf { it.total } }
        .toList()
        .sortedByDescending { it.second }

    revenue.forEach { (name, total) -> println("%-6s %8.2f".format(name, total)) }
}
