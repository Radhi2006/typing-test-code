// @codetype easy | Safe calls, elvis operator and let
data class Address(val city: String?)
data class Customer(val name: String, val address: Address?)

fun cityOf(customer: Customer?): String =
    customer?.address?.city?.uppercase() ?: "UNKNOWN"

fun main() {
    val customer = Customer("Rina", Address("Bandung"))
    println(cityOf(customer))
    println(cityOf(null))
    customer.address?.city?.let { println("Ships to $it") }
}
