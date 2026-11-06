// @codetype easy | Extension functions and properties on String
fun String.isPalindrome(): Boolean {
    val clean = filter { it.isLetterOrDigit() }.lowercase()
    return clean == clean.reversed()
}

val String.wordCount: Int
    get() = trim().split(Regex("\\s+")).count { it.isNotEmpty() }

fun main() {
    println("Never odd or even".isPalindrome())
    println("type real code every day".wordCount)
}
