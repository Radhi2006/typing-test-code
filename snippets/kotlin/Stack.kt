// @codetype medium | Generic stack class backed by ArrayDeque
class Stack<T> {
    private val items = ArrayDeque<T>()

    val size: Int get() = items.size
    fun isEmpty() = items.isEmpty()

    fun push(item: T) = items.addLast(item)

    fun pop(): T = items.removeLastOrNull()
        ?: throw NoSuchElementException("Stack is empty")

    fun peek(): T? = items.lastOrNull()
}

fun main() {
    val stack = Stack<String>()
    stack.push("kotlin")
    stack.push("java")
    println("${stack.pop()} ${stack.peek()} ${stack.size}")
}
