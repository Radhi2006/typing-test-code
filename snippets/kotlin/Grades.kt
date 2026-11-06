// @codetype easy | when expression with ranges
fun grade(score: Int): String = when (score) {
    in 90..100 -> "A"
    in 80 until 90 -> "B"
    in 70 until 80 -> "C"
    in 60 until 70 -> "D"
    in 0 until 60 -> "E"
    else -> throw IllegalArgumentException("Invalid score: $score")
}

fun main() {
    listOf(95, 83, 71, 40).forEach { println("$it -> ${grade(it)}") }
}
