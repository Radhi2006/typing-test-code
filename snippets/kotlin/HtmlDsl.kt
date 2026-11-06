// @codetype hard | Type-safe builder DSL with lambdas with receivers
class Tag(private val name: String) {
    private val children = mutableListOf<String>()

    fun tag(name: String, block: Tag.() -> Unit = {}) {
        children += Tag(name).apply(block).render()
    }

    operator fun String.unaryPlus() {
        children += this
    }

    fun render(): String = "<$name>${children.joinToString("")}</$name>"
}

fun html(block: Tag.() -> Unit): String = Tag("html").apply(block).render()

fun main() {
    val page = html {
        tag("body") {
            tag("h1") { +"CodeType" }
            tag("p") { +"Type real code." }
        }
    }
    println(page)
}
