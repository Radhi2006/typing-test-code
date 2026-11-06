// @codetype medium | Lazy sequences with generateSequence
fun fibonacci(): Sequence<Long> =
    generateSequence(0L to 1L) { (a, b) -> b to a + b }.map { it.first }

fun primes(): Sequence<Int> = generateSequence(2) { it + 1 }
    .filter { n -> (2..n / 2).none { n % it == 0 } }

fun main() {
    println(fibonacci().take(10).toList())
    println(primes().take(10).joinToString())
}
