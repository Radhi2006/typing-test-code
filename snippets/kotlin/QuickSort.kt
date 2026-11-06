// @codetype medium | Functional quicksort with partition
fun <T : Comparable<T>> List<T>.quickSort(): List<T> {
    if (size <= 1) return this
    val pivot = first()
    val (smaller, larger) = drop(1).partition { it < pivot }
    return smaller.quickSort() + pivot + larger.quickSort()
}

fun main() {
    println(listOf(9, 4, 7, 1, 8, 2).quickSort())
    println(listOf("kotlin", "go", "rust", "c").quickSort())
}
