// @codetype medium | LRU cache from an access-ordered LinkedHashMap
class LruCache<K, V>(private val capacity: Int) :
    LinkedHashMap<K, V>(capacity, 0.75f, true) {

    override fun removeEldestEntry(eldest: MutableMap.MutableEntry<K, V>?): Boolean =
        size > capacity
}

fun main() {
    val cache = LruCache<String, Int>(2)
    cache["a"] = 1
    cache["b"] = 2
    cache["a"]
    cache["c"] = 3
    println(cache.keys) // [a, c]
}
