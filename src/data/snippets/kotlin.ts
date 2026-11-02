import { CodeSnippet } from '../../types/snippet';

const snippets: CodeSnippet[] = [
  {
    id: 'kt-001',
    language: 'kotlin',
    title: 'Data Class',
    description: 'Data class with copy and destructuring',
    code: `data class User(val name: String, val age: Int)

val user = User("Alice", 30)
val older = user.copy(age = 31)
val (name, age) = older`,
    difficulty: 'easy',
    tags: ['data-class', 'basics'],
  },
  {
    id: 'kt-002',
    language: 'kotlin',
    title: 'Null Safety',
    description: 'Safe calls and elvis operator',
    code: `fun getLength(str: String?): Int {
  val length = str?.length ?: 0
  return length
}`,
    difficulty: 'easy',
    tags: ['null-safety', 'operators'],
  },
  {
    id: 'kt-003',
    language: 'kotlin',
    title: 'Extension Function',
    description: 'Add a method to the String class',
    code: `fun String.isPalindrome(): Boolean {
  val cleaned = this.lowercase().filter { it.isLetterOrDigit() }
  return cleaned == cleaned.reversed()
}`,
    difficulty: 'easy',
    tags: ['extension-functions', 'string'],
  },
  {
    id: 'kt-004',
    language: 'kotlin',
    title: 'When Expression',
    description: 'Pattern matching with when',
    code: `fun describe(obj: Any): String = when (obj) {
  is Int -> "Integer: $obj"
  is String -> "String of length \${obj.length}"
  is List<*> -> "List of size \${obj.size}"
  else -> "Unknown"
}`,
    difficulty: 'easy',
    tags: ['when', 'pattern-matching'],
  },
  {
    id: 'kt-005',
    language: 'kotlin',
    title: 'Sealed Class',
    description: 'Sealed class hierarchy for UI state',
    code: `sealed class UiState<out T> {
  object Loading : UiState<Nothing>()
  data class Success<T>(val data: T) : UiState<T>()
  data class Error(val message: String) : UiState<Nothing>()
}

fun <T> handleState(state: UiState<T>) = when (state) {
  is UiState.Loading -> println("Loading...")
  is UiState.Success -> println("Data: \${state.data}")
  is UiState.Error -> println("Error: \${state.message}")
}`,
    difficulty: 'medium',
    tags: ['sealed-class', 'generics'],
  },
  {
    id: 'kt-006',
    language: 'kotlin',
    title: 'Higher-Order Function',
    description: 'Function that takes a function parameter',
    code: `fun <T> List<T>.customFilter(predicate: (T) -> Boolean): List<T> {
  val result = mutableListOf<T>()
  for (item in this) {
    if (predicate(item)) {
      result.add(item)
    }
  }
  return result
}`,
    difficulty: 'medium',
    tags: ['higher-order-functions', 'generics'],
  },
  {
    id: 'kt-007',
    language: 'kotlin',
    title: 'Companion Object',
    description: 'Factory method using companion object',
    code: `class Color private constructor(val hex: String) {
  companion object {
    fun fromRGB(r: Int, g: Int, b: Int): Color {
      val hex = "#%02x%02x%02x".format(r, g, b)
      return Color(hex)
    }

    val RED = Color("#ff0000")
    val GREEN = Color("#00ff00")
    val BLUE = Color("#0000ff")
  }
}`,
    difficulty: 'medium',
    tags: ['companion-object', 'factory'],
  },
  {
    id: 'kt-008',
    language: 'kotlin',
    title: 'Delegation Pattern',
    description: 'Interface delegation with by keyword',
    code: `interface Logger {
  fun log(message: String)
}

class ConsoleLogger : Logger {
  override fun log(message: String) = println("[LOG] $message")
}

class UserService(logger: Logger) : Logger by logger {
  fun createUser(name: String) {
    log("Creating user: $name")
  }
}`,
    difficulty: 'medium',
    tags: ['delegation', 'interface'],
  },
  {
    id: 'kt-009',
    language: 'kotlin',
    title: 'Coroutine Launch',
    description: 'Launch coroutines with structured concurrency',
    code: `suspend fun fetchUserData(userId: Int): UserData = coroutineScope {
  val profileDeferred = async { fetchProfile(userId) }
  val ordersDeferred = async { fetchOrders(userId) }

  UserData(
    profile = profileDeferred.await(),
    orders = ordersDeferred.await()
  )
}

suspend fun fetchProfile(id: Int): Profile = withContext(Dispatchers.IO) {
  api.getProfile(id)
}`,
    difficulty: 'hard',
    tags: ['coroutines', 'async', 'concurrency'],
  },
  {
    id: 'kt-010',
    language: 'kotlin',
    title: 'Flow Operators',
    description: 'Reactive stream with Kotlin Flow',
    code: `fun searchUsers(query: StateFlow<String>): Flow<List<User>> =
  query
    .debounce(300)
    .filter { it.length >= 2 }
    .distinctUntilChanged()
    .flatMapLatest { searchText ->
      flow {
        emit(repository.search(searchText))
      }
    }
    .catch { e ->
      emit(emptyList())
    }
    .flowOn(Dispatchers.IO)`,
    difficulty: 'hard',
    tags: ['flow', 'reactive', 'coroutines'],
  },
  {
    id: 'kt-011',
    language: 'kotlin',
    title: 'DSL Builder',
    description: 'Type-safe HTML DSL builder',
    code: `class HtmlBuilder {
  private val elements = mutableListOf<String>()

  fun div(init: HtmlBuilder.() -> Unit) {
    elements.add("<div>")
    this.init()
    elements.add("</div>")
  }

  fun p(text: String) {
    elements.add("<p>$text</p>")
  }

  fun build(): String = elements.joinToString("
")
}

fun html(init: HtmlBuilder.() -> Unit): String {
  return HtmlBuilder().apply(init).build()
}`,
    difficulty: 'hard',
    tags: ['dsl', 'builder', 'lambda-receiver'],
  },
  {
    id: 'kt-012',
    language: 'kotlin',
    title: 'Generic Repository',
    description: 'Abstract generic repository with CRUD operations',
    code: `abstract class BaseRepository<T, ID> {
  protected val store = mutableMapOf<ID, T>()

  fun findById(id: ID): T? = store[id]

  fun findAll(): List<T> = store.values.toList()

  fun save(id: ID, entity: T): T {
    store[id] = entity
    return entity
  }

  fun deleteById(id: ID): Boolean = store.remove(id) != null

  fun existsById(id: ID): Boolean = store.containsKey(id)

  fun count(): Int = store.size
}`,
    difficulty: 'hard',
    tags: ['generics', 'repository', 'abstract'],
  },
];

export default snippets;
