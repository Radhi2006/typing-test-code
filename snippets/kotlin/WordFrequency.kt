// @codetype easy | Most frequent words using groupingBy
fun topWords(text: String, n: Int = 3): List<Pair<String, Int>> =
    text.lowercase()
        .split(Regex("\\W+"))
        .filter { it.isNotBlank() }
        .groupingBy { it }
        .eachCount()
        .toList()
        .sortedByDescending { it.second }
        .take(n)

fun main() {
    println(topWords("the cat and the hat and the bat"))
}
