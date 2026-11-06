// @codetype medium | Preconditions with require and check
class Wallet(val owner: String, initial: Long = 0) {
    var balance: Long = initial
        private set

    fun deposit(amount: Long) {
        require(amount > 0) { "Deposit must be positive, was $amount" }
        balance += amount
    }

    fun pay(amount: Long) {
        require(amount > 0) { "Payment must be positive" }
        check(balance >= amount) { "$owner cannot afford $amount" }
        balance -= amount
    }
}

fun main() {
    val wallet = Wallet("Dian", 50_000)
    wallet.pay(20_000)
    println(wallet.balance)
}
