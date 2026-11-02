import { CodeSnippet } from '../../types/snippet';

const snippets: CodeSnippet[] = [
  {
    id: 'php-001',
    language: 'php',
    title: 'Array Map',
    description: 'Transform array values using array_map',
    code: `$numbers = [1, 2, 3, 4, 5];
$squared = array_map(fn($n) => $n ** 2, $numbers);
print_r($squared);`,
    difficulty: 'easy',
    tags: ['array', 'functions'],
  },
  {
    id: 'php-002',
    language: 'php',
    title: 'Array Filter',
    description: 'Filter even numbers from an array',
    code: `$numbers = [1, 2, 3, 4, 5, 6];
$even = array_filter($numbers, fn($n) => $n % 2 === 0);
$even = array_values($even);`,
    difficulty: 'easy',
    tags: ['array', 'filter'],
  },
  {
    id: 'php-003',
    language: 'php',
    title: 'Simple Class',
    description: 'Basic PHP class with constructor',
    code: `class User
{
  public function __construct(
    public string $name,
    public string $email
  ) {}
}`,
    difficulty: 'easy',
    tags: ['class', 'constructor'],
  },
  {
    id: 'php-004',
    language: 'php',
    title: 'Named Arguments',
    description: 'Function call with named arguments',
    code: `function createUser(string $name, int $age, string $role = 'user'): array
{
  return compact('name', 'age', 'role');
}

$user = createUser(name: 'Alice', age: 30, role: 'admin');`,
    difficulty: 'easy',
    tags: ['named-arguments', 'functions'],
  },
  {
    id: 'php-005',
    language: 'php',
    title: 'PHP Enum',
    description: 'Backed enum with string values',
    code: `enum Status: string
{
  case Active = 'active';
  case Inactive = 'inactive';
  case Pending = 'pending';
}`,
    difficulty: 'easy',
    tags: ['enum', 'types'],
  },
  {
    id: 'php-006',
    language: 'php',
    title: 'Interface Definition',
    description: 'Define and implement a repository interface',
    code: `interface UserRepository
{
  public function find(int $id): ?User;
  public function findAll(): array;
  public function save(User $user): void;
  public function delete(int $id): void;
}`,
    difficulty: 'medium',
    tags: ['interface', 'repository'],
  },
  {
    id: 'php-007',
    language: 'php',
    title: 'Trait Usage',
    description: 'Define a trait with timestamp methods',
    code: `trait HasTimestamps
{
  public DateTime $createdAt;
  public DateTime $updatedAt;

  public function touch(): void
  {
    $this->updatedAt = new DateTime();
  }
}`,
    difficulty: 'medium',
    tags: ['trait', 'datetime'],
  },
  {
    id: 'php-008',
    language: 'php',
    title: 'Closure Binding',
    description: 'Closure with use keyword to capture variables',
    code: `function makeMultiplier(int $factor): Closure
{
  return function (int $n) use ($factor): int {
    return $n * $factor;
  };
}

$double = makeMultiplier(2);
echo $double(5);`,
    difficulty: 'medium',
    tags: ['closure', 'functions'],
  },
  {
    id: 'php-009',
    language: 'php',
    title: 'PDO Select Query',
    description: 'Fetch records using PDO prepared statement',
    code: `function findByEmail(PDO $pdo, string $email): ?array
{
  $stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
  $stmt->execute(['email' => $email]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);
  return $user ?: null;
}`,
    difficulty: 'medium',
    tags: ['pdo', 'database', 'query'],
  },
  {
    id: 'php-010',
    language: 'php',
    title: 'Array Reduce',
    description: 'Sum order totals using array_reduce',
    code: `$orders = [
  ['product' => 'Book', 'total' => 15.99],
  ['product' => 'Pen', 'total' => 2.50],
  ['product' => 'Notebook', 'total' => 8.00],
];

$sum = array_reduce($orders, fn($carry, $order) => $carry + $order['total'], 0);`,
    difficulty: 'medium',
    tags: ['array', 'reduce'],
  },
  {
    id: 'php-011',
    language: 'php',
    title: 'Middleware Class',
    description: 'PSR-15 style middleware for authentication',
    code: `class AuthMiddleware
{
  public function __construct(
    private TokenValidator $validator
  ) {}

  public function process(Request $request, Handler $handler): Response
  {
    $token = $request->getHeaderLine('Authorization');
    if (!$this->validator->validate($token)) {
      return new Response(401, [], 'Unauthorized');
    }
    return $handler->handle($request);
  }
}`,
    difficulty: 'hard',
    tags: ['middleware', 'authentication'],
  },
  {
    id: 'php-012',
    language: 'php',
    title: 'Service Container',
    description: 'Simple dependency injection container',
    code: `class Container
{
  private array $bindings = [];
  private array $instances = [];

  public function bind(string $key, Closure $factory): void
  {
    $this->bindings[$key] = $factory;
  }

  public function resolve(string $key): mixed
  {
    if (isset($this->instances[$key])) {
      return $this->instances[$key];
    }
    $instance = ($this->bindings[$key])($this);
    $this->instances[$key] = $instance;
    return $instance;
  }
}`,
    difficulty: 'hard',
    tags: ['container', 'dependency-injection'],
  },
  {
    id: 'php-013',
    language: 'php',
    title: 'Enum with Methods',
    description: 'Enum with custom methods and interface',
    code: `enum Color: string
{
  case Red = '#FF0000';
  case Green = '#00FF00';
  case Blue = '#0000FF';

  public function rgb(): array
  {
    $hex = ltrim($this->value, '#');
    return [
      hexdec(substr($hex, 0, 2)),
      hexdec(substr($hex, 2, 2)),
      hexdec(substr($hex, 4, 2)),
    ];
  }
}`,
    difficulty: 'hard',
    tags: ['enum', 'methods'],
  },
  {
    id: 'php-014',
    language: 'php',
    title: 'Abstract Repository',
    description: 'Abstract class implementing repository pattern',
    code: `abstract class AbstractRepository
{
  public function __construct(
    protected PDO $pdo
  ) {}

  abstract protected function tableName(): string;

  public function findById(int $id): ?array
  {
    $table = $this->tableName();
    $stmt = $this->pdo->prepare("SELECT * FROM {$table} WHERE id = :id");
    $stmt->execute(['id' => $id]);
    return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
  }

  public function delete(int $id): bool
  {
    $table = $this->tableName();
    $stmt = $this->pdo->prepare("DELETE FROM {$table} WHERE id = :id");
    return $stmt->execute(['id' => $id]);
  }
}`,
    difficulty: 'hard',
    tags: ['abstract', 'repository', 'pdo'],
  },
  {
    id: 'php-015',
    language: 'php',
    title: 'Event Dispatcher',
    description: 'Simple event dispatcher with listeners',
    code: `class EventDispatcher
{
  private array $listeners = [];

  public function listen(string $event, callable $listener): void
  {
    $this->listeners[$event][] = $listener;
  }

  public function dispatch(string $event, array $data = []): void
  {
    foreach ($this->listeners[$event] ?? [] as $listener) {
      $listener($data);
    }
  }
}`,
    difficulty: 'hard',
    tags: ['events', 'dispatcher', 'pattern'],
  },
];

export default snippets;
