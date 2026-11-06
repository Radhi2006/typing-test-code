// @codetype easy | Binary search as an extension on List<Int>
fun List<Int>.binarySearchIndex(target: Int): Int {
    var low = 0
    var high = size - 1
    while (low <= high) {
        val mid = (low + high) ushr 1
        when {
            this[mid] == target -> return mid
            this[mid] < target -> low = mid + 1
            else -> high = mid - 1
        }
    }
    return -1
}

fun main() {
    println(listOf(2, 4, 6, 8, 10).binarySearchIndex(8))
}
