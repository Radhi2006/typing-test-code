import { CodeSnippet } from '../../types/snippet';

const snippets: CodeSnippet[] = [
  {
    id: 'swift-001',
    language: 'swift',
    title: 'Optional Binding',
    description: 'Safely unwrap an optional with if-let',
    code: `func greet(_ name: String?) {
  if let name = name {
    print("Hello, \\(name)!")
  } else {
    print("Hello, stranger!")
  }
}`,
    difficulty: 'easy',
    tags: ['optionals', 'control-flow'],
  },
  {
    id: 'swift-002',
    language: 'swift',
    title: 'Closure Syntax',
    description: 'Sort array using trailing closure',
    code: `let names = ["Charlie", "Alice", "Bob"]
let sorted = names.sorted { $0 < $1 }
let lengths = names.map { $0.count }`,
    difficulty: 'easy',
    tags: ['closures', 'array'],
  },
  {
    id: 'swift-003',
    language: 'swift',
    title: 'Struct Definition',
    description: 'Value type with computed property',
    code: `struct Rectangle {
  var width: Double
  var height: Double

  var area: Double {
    width * height
  }
}`,
    difficulty: 'easy',
    tags: ['struct', 'computed-property'],
  },
  {
    id: 'swift-004',
    language: 'swift',
    title: 'Guard Statement',
    description: 'Early return with guard-let',
    code: `func process(data: [String: Any]) {
  guard let name = data["name"] as? String else {
    return
  }
  print("Processing \\(name)")
}`,
    difficulty: 'easy',
    tags: ['optionals', 'guard'],
  },
  {
    id: 'swift-005',
    language: 'swift',
    title: 'Protocol Extension',
    description: 'Protocol with default implementation',
    code: `protocol Describable {
  var description: String { get }
}

extension Describable {
  var description: String {
    "\\(type(of: self))"
  }
}

struct Item: Describable {
  let name: String
}`,
    difficulty: 'medium',
    tags: ['protocols', 'extensions'],
  },
  {
    id: 'swift-006',
    language: 'swift',
    title: 'Enum with Associated Values',
    description: 'Enum representing network responses',
    code: `enum NetworkResult {
  case success(data: Data)
  case failure(error: Error)
  case loading(progress: Double)
}

func handle(_ result: NetworkResult) {
  switch result {
  case .success(let data):
    print("Received \\(data.count) bytes")
  case .failure(let error):
    print("Error: \\(error.localizedDescription)")
  case .loading(let progress):
    print("Loading: \\(progress * 100)%")
  }
}`,
    difficulty: 'medium',
    tags: ['enums', 'associated-values', 'pattern-matching'],
  },
  {
    id: 'swift-007',
    language: 'swift',
    title: 'Generic Stack',
    description: 'Generic stack data structure',
    code: `struct Stack<Element> {
  private var items: [Element] = []

  mutating func push(_ item: Element) {
    items.append(item)
  }

  mutating func pop() -> Element? {
    items.popLast()
  }

  var isEmpty: Bool { items.isEmpty }
  var peek: Element? { items.last }
}`,
    difficulty: 'medium',
    tags: ['generics', 'data-structures'],
  },
  {
    id: 'swift-008',
    language: 'swift',
    title: 'Result Type',
    description: 'Use Result type for error handling',
    code: `enum ValidationError: Error {
  case tooShort
  case invalidFormat
}

func validate(email: String) -> Result<String, ValidationError> {
  guard email.count >= 5 else {
    return .failure(.tooShort)
  }
  guard email.contains("@") else {
    return .failure(.invalidFormat)
  }
  return .success(email)
}`,
    difficulty: 'medium',
    tags: ['result', 'error-handling'],
  },
  {
    id: 'swift-009',
    language: 'swift',
    title: 'Async Await Fetch',
    description: 'Fetch and decode JSON asynchronously',
    code: `struct User: Codable {
  let id: Int
  let name: String
  let email: String
}

func fetchUser(id: Int) async throws -> User {
  let url = URL(string: "https://api.example.com/users/\\(id)")!
  let (data, response) = try await URLSession.shared.data(from: url)
  guard let http = response as? HTTPURLResponse,
        http.statusCode == 200 else {
    throw URLError(.badServerResponse)
  }
  return try JSONDecoder().decode(User.self, from: data)
}`,
    difficulty: 'hard',
    tags: ['async', 'codable', 'networking'],
  },
  {
    id: 'swift-010',
    language: 'swift',
    title: 'Property Wrapper',
    description: 'Custom property wrapper for clamping values',
    code: `@propertyWrapper
struct Clamped {
  var wrappedValue: Int {
    didSet {
      wrappedValue = min(max(wrappedValue, range.lowerBound), range.upperBound)
    }
  }
  let range: ClosedRange<Int>

  init(wrappedValue: Int, _ range: ClosedRange<Int>) {
    self.range = range
    self.wrappedValue = min(max(wrappedValue, range.lowerBound), range.upperBound)
  }
}

struct Volume {
  @Clamped(0...100) var level: Int = 50
}`,
    difficulty: 'hard',
    tags: ['property-wrappers', 'custom'],
  },
  {
    id: 'swift-011',
    language: 'swift',
    title: 'Protocol with Associated Type',
    description: 'Generic protocol using associated types',
    code: `protocol Repository {
  associatedtype Entity
  associatedtype ID: Hashable

  func findById(_ id: ID) async throws -> Entity?
  func findAll() async throws -> [Entity]
  func save(_ entity: Entity) async throws
  func delete(_ id: ID) async throws
}

struct UserRepo: Repository {
  typealias Entity = User
  typealias ID = Int

  func findById(_ id: Int) async throws -> User? { nil }
  func findAll() async throws -> [User] { [] }
  func save(_ entity: User) async throws {}
  func delete(_ id: Int) async throws {}
}`,
    difficulty: 'hard',
    tags: ['protocols', 'associated-types', 'generics'],
  },
  {
    id: 'swift-012',
    language: 'swift',
    title: 'Codable with Custom Keys',
    description: 'Custom Codable implementation with key mapping',
    code: `struct Product: Codable {
  let id: Int
  let productName: String
  let unitPrice: Double
  let inStock: Bool

  enum CodingKeys: String, CodingKey {
    case id
    case productName = "product_name"
    case unitPrice = "unit_price"
    case inStock = "in_stock"
  }

  var formattedPrice: String {
    String(format: "$%.2f", unitPrice)
  }
}`,
    difficulty: 'hard',
    tags: ['codable', 'json', 'serialization'],
  },
];

export default snippets;
