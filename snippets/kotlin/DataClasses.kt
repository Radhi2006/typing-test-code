// @codetype easy | Data classes with copy and destructuring
data class User(
    val id: Int,
    val name: String,
    val email: String,
    val active: Boolean = true,
)

fun main() {
    val ada = User(1, "Ada", "ada@example.com")
    val renamed = ada.copy(name = "Ada Lovelace")
    val (id, name) = renamed

    println(ada)
    println("$id -> $name")
    println(ada == renamed.copy(name = "Ada"))
}
