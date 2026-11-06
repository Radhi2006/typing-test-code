// @codetype medium | Sealed classes for modelling results
sealed interface NetworkResult<out T> {
    data class Success<T>(val data: T) : NetworkResult<T>
    data class Failure(val code: Int, val message: String) : NetworkResult<Nothing>
    data object Loading : NetworkResult<Nothing>
}

fun render(result: NetworkResult<List<String>>): String = when (result) {
    is NetworkResult.Success -> "Loaded ${result.data.size} items"
    is NetworkResult.Failure -> "Error ${result.code}: ${result.message}"
    NetworkResult.Loading -> "Loading..."
}

fun main() {
    println(render(NetworkResult.Success(listOf("a", "b"))))
    println(render(NetworkResult.Failure(404, "Not found")))
}
