import { CodeSnippet } from '../../types/snippet';

const snippets: CodeSnippet[] = [
  {
    id: 'java-001',
    language: 'java',
    title: 'Hello World Class',
    description: 'Basic Java class with main method',
    code: `public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
    difficulty: 'easy',
    tags: ['basics', 'class'],
  },
  {
    id: 'java-002',
    language: 'java',
    title: 'ArrayList Operations',
    description: 'Common ArrayList operations',
    code: `List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.remove(0);
String first = names.get(0);
int size = names.size();`,
    difficulty: 'easy',
    tags: ['collections', 'arraylist'],
  },
  {
    id: 'java-003',
    language: 'java',
    title: 'HashMap Basics',
    description: 'Basic HashMap usage and iteration',
    code: `Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);
int score = scores.getOrDefault("Alice", 0);
scores.forEach((k, v) -> System.out.println(k + ": " + v));`,
    difficulty: 'easy',
    tags: ['collections', 'hashmap'],
  },
  {
    id: 'java-004',
    language: 'java',
    title: 'StringBuilder',
    description: 'Efficient string concatenation with StringBuilder',
    code: `StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10; i++) {
  sb.append("item ").append(i).append(", ");
}
String result = sb.toString().trim();`,
    difficulty: 'easy',
    tags: ['strings', 'performance'],
  },
  {
    id: 'java-005',
    language: 'java',
    title: 'For-Each Loop',
    description: 'Enhanced for loop over a collection',
    code: `int[] numbers = {1, 2, 3, 4, 5};
int sum = 0;
for (int num : numbers) {
  sum += num;
}
System.out.println("Sum: " + sum);`,
    difficulty: 'easy',
    tags: ['loops', 'arrays'],
  },
  {
    id: 'java-006',
    language: 'java',
    title: 'Static Method',
    description: 'Utility class with a static helper method',
    code: `public class MathUtils {
  public static int clamp(int value, int min, int max) {
    return Math.max(min, Math.min(max, value));
  }
}`,
    difficulty: 'easy',
    tags: ['methods', 'static'],
  },
  {
    id: 'java-007',
    language: 'java',
    title: 'Constructor',
    description: 'Class with constructor and fields',
    code: `public class Person {
  private String name;
  private int age;

  public Person(String name, int age) {
    this.name = name;
    this.age = age;
  }
}`,
    difficulty: 'easy',
    tags: ['class', 'constructor'],
  },
  {
    id: 'java-008',
    language: 'java',
    title: 'Generic Class',
    description: 'A generic Pair class with two type parameters',
    code: `public class Pair<K, V> {
  private K key;
  private V value;

  public Pair(K key, V value) {
    this.key = key;
    this.value = value;
  }

  public K getKey() { return key; }
  public V getValue() { return value; }
}`,
    difficulty: 'medium',
    tags: ['generics', 'class'],
  },
  {
    id: 'java-009',
    language: 'java',
    title: 'Comparator',
    description: 'Custom comparator for sorting objects',
    code: `List<Person> people = new ArrayList<>(list);
people.sort(Comparator
  .comparing(Person::getLastName)
  .thenComparing(Person::getFirstName)
  .thenComparingInt(Person::getAge));
return Collections.unmodifiableList(people);`,
    difficulty: 'medium',
    tags: ['sorting', 'comparator'],
  },
  {
    id: 'java-010',
    language: 'java',
    title: 'Iterator Pattern',
    description: 'Custom iterator implementation over a range',
    code: `public class Range implements Iterable<Integer> {
  private final int start;
  private final int end;

  public Range(int start, int end) {
    this.start = start;
    this.end = end;
  }

  public Iterator<Integer> iterator() {
    return new Iterator<>() {
      private int current = start;
      public boolean hasNext() { return current < end; }
      public Integer next() { return current++; }
    };
  }
}`,
    difficulty: 'medium',
    tags: ['iterator', 'design-pattern'],
  },
  {
    id: 'java-011',
    language: 'java',
    title: 'Singleton Pattern',
    description: 'Thread-safe singleton using enum',
    code: `public enum DatabaseConnection {
  INSTANCE;

  private Connection conn;

  public void connect(String url) {
    this.conn = DriverManager.getConnection(url);
  }

  public Connection getConnection() {
    return conn;
  }
}`,
    difficulty: 'medium',
    tags: ['design-pattern', 'singleton'],
  },
  {
    id: 'java-012',
    language: 'java',
    title: 'Observer Pattern',
    description: 'Simple event listener system',
    code: `public interface EventListener<T> {
  void onEvent(T data);
}

public class EventBus<T> {
  private final List<EventListener<T>> listeners = new ArrayList<>();

  public void subscribe(EventListener<T> listener) {
    listeners.add(listener);
  }

  public void publish(T event) {
    listeners.forEach(l -> l.onEvent(event));
  }
}`,
    difficulty: 'medium',
    tags: ['design-pattern', 'observer'],
  },
  {
    id: 'java-013',
    language: 'java',
    title: 'Stream API',
    description: 'Processing collections with Java streams',
    code: `List<String> result = employees.stream()
  .filter(e -> e.getSalary() > 50000)
  .sorted(Comparator.comparing(Employee::getName))
  .map(Employee::getName)
  .collect(Collectors.toList());`,
    difficulty: 'medium',
    tags: ['streams', 'functional'],
  },
  {
    id: 'java-014',
    language: 'java',
    title: 'Exception Handling',
    description: 'Try-with-resources and custom exception',
    code: `public String readFile(String path) throws FileException {
  try (BufferedReader reader = new BufferedReader(
      new FileReader(path))) {
    return reader.lines()
      .collect(Collectors.joining("
"));
  } catch (IOException e) {
    throw new FileException("Failed to read: " + path, e);
  }
}`,
    difficulty: 'medium',
    tags: ['exceptions', 'io'],
  },
  {
    id: 'java-015',
    language: 'java',
    title: 'Binary Tree',
    description: 'Binary search tree with insert and search',
    code: `public class BST<T extends Comparable<T>> {
  private T value;
  private BST<T> left, right;

  public BST(T value) { this.value = value; }

  public void insert(T item) {
    if (item.compareTo(value) < 0) {
      if (left == null) left = new BST<>(item);
      else left.insert(item);
    } else {
      if (right == null) right = new BST<>(item);
      else right.insert(item);
    }
  }
}`,
    difficulty: 'hard',
    tags: ['data-structure', 'tree', 'recursion'],
  },
  {
    id: 'java-016',
    language: 'java',
    title: 'Thread Pool',
    description: 'Custom thread pool with task submission',
    code: `public class TaskRunner {
  private final ExecutorService pool;

  public TaskRunner(int threads) {
    this.pool = Executors.newFixedThreadPool(threads);
  }

  public <T> Future<T> submit(Callable<T> task) {
    return pool.submit(task);
  }

  public void shutdown() {
    pool.shutdown();
    try {
      pool.awaitTermination(30, TimeUnit.SECONDS);
    } catch (InterruptedException e) {
      pool.shutdownNow();
    }
  }
}`,
    difficulty: 'hard',
    tags: ['concurrency', 'threads'],
  },
  {
    id: 'java-017',
    language: 'java',
    title: 'Concurrent HashMap Usage',
    description: 'Thread-safe cache with ConcurrentHashMap',
    code: `public class Cache<K, V> {
  private final ConcurrentHashMap<K, V> map = new ConcurrentHashMap<>();

  public V getOrCompute(K key, Function<K, V> loader) {
    return map.computeIfAbsent(key, loader);
  }

  public void put(K key, V value) {
    map.put(key, value);
  }

  public Optional<V> get(K key) {
    return Optional.ofNullable(map.get(key));
  }

  public void invalidate(K key) {
    map.remove(key);
  }
}`,
    difficulty: 'hard',
    tags: ['concurrency', 'collections'],
  },
  {
    id: 'java-018',
    language: 'java',
    title: 'Generic DAO',
    description: 'Generic data access object pattern',
    code: `public abstract class GenericDao<T, ID> {
  private final Class<T> entityClass;
  protected EntityManager em;

  protected GenericDao(Class<T> entityClass) {
    this.entityClass = entityClass;
  }

  public T findById(ID id) {
    return em.find(entityClass, id);
  }

  public List<T> findAll() {
    return em.createQuery(
      "FROM " + entityClass.getSimpleName(), entityClass
    ).getResultList();
  }
}`,
    difficulty: 'hard',
    tags: ['generics', 'design-pattern', 'database'],
  },
  {
    id: 'java-019',
    language: 'java',
    title: 'Annotation Processor',
    description: 'Custom annotation with retention policy',
    code: `@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Cacheable {
  long ttl() default 3600;
  String key() default "";
}

public class CacheAspect {
  public Object around(ProceedingJoinPoint pjp) throws Throwable {
    Cacheable annotation = getAnnotation(pjp);
    String key = buildKey(annotation, pjp);
    Object cached = cache.get(key);
    return cached != null ? cached : pjp.proceed();
  }
}`,
    difficulty: 'hard',
    tags: ['annotations', 'reflection'],
  },
  {
    id: 'java-020',
    language: 'java',
    title: 'Builder Pattern with Generics',
    description: 'Type-safe builder using generics and fluent API',
    code: `public class Request<T> {
  private final String url;
  private final Class<T> responseType;
  private final Map<String, String> headers;

  private Request(Builder<T> builder) {
    this.url = builder.url;
    this.responseType = builder.responseType;
    this.headers = Map.copyOf(builder.headers);
  }

  public static <T> Builder<T> builder(String url, Class<T> type) {
    return new Builder<>(url, type);
  }

  public static class Builder<T> {
    private final String url;
    private final Class<T> responseType;
    private final Map<String, String> headers = new HashMap<>();

    private Builder(String url, Class<T> responseType) {
      this.url = url;
      this.responseType = responseType;
    }

    public Builder<T> header(String key, String value) {
      headers.put(key, value);
      return this;
    }

    public Request<T> build() {
      return new Request<>(this);
    }
  }
}`,
    difficulty: 'hard',
    tags: ['design-pattern', 'builder', 'generics'],
  },
];

export default snippets;
