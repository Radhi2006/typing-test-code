import { CodeSnippet } from '../../types/snippet';

const snippets: CodeSnippet[] = [
  {
    id: 'go-001',
    language: 'go',
    title: 'Hello World',
    description: 'Basic Go program with fmt package',
    code: `package main

import "fmt"

func main() {
  fmt.Println("Hello, World!")
}`,
    difficulty: 'easy',
    tags: ['basics'],
  },
  {
    id: 'go-002',
    language: 'go',
    title: 'Slice Operations',
    description: 'Common slice creation and manipulation',
    code: `nums := []int{1, 2, 3, 4, 5}
nums = append(nums, 6)
slice := nums[1:4]
copy := make([]int, len(nums))
_ = copy
fmt.Println(len(nums), cap(nums))`,
    difficulty: 'easy',
    tags: ['slices', 'basics'],
  },
  {
    id: 'go-003',
    language: 'go',
    title: 'Map Usage',
    description: 'Creating and iterating over maps',
    code: `scores := map[string]int{
  "Alice": 95,
  "Bob":   87,
}
scores["Charlie"] = 92
if val, ok := scores["Alice"]; ok {
  fmt.Println("Alice:", val)
}`,
    difficulty: 'easy',
    tags: ['maps', 'basics'],
  },
  {
    id: 'go-004',
    language: 'go',
    title: 'Struct Method',
    description: 'Struct with receiver methods',
    code: `type Rectangle struct {
  Width  float64
  Height float64
}

func (r Rectangle) Area() float64 {
  return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
  return 2 * (r.Width + r.Height)
}`,
    difficulty: 'easy',
    tags: ['structs', 'methods'],
  },
  {
    id: 'go-005',
    language: 'go',
    title: 'Goroutine Basic',
    description: 'Launching a simple goroutine with WaitGroup',
    code: `var wg sync.WaitGroup
for i := 0; i < 5; i++ {
  wg.Add(1)
  go func(n int) {
    defer wg.Done()
    fmt.Println("Worker", n)
  }(i)
}
wg.Wait()`,
    difficulty: 'easy',
    tags: ['goroutines', 'concurrency'],
  },
  {
    id: 'go-006',
    language: 'go',
    title: 'Error Handling',
    description: 'Idiomatic Go error handling',
    code: `func divide(a, b float64) (float64, error) {
  if b == 0 {
    return 0, fmt.Errorf("division by zero: %f / %f", a, b)
  }
  return a / b, nil
}`,
    difficulty: 'easy',
    tags: ['errors', 'basics'],
  },
  {
    id: 'go-007',
    language: 'go',
    title: 'Interface Implementation',
    description: 'Defining and implementing an interface',
    code: `type Shape interface {
  Area() float64
  String() string
}

type Circle struct {
  Radius float64
}

func (c Circle) Area() float64 {
  return math.Pi * c.Radius * c.Radius
}

func (c Circle) String() string {
  return fmt.Sprintf("Circle(r=%.2f)", c.Radius)
}`,
    difficulty: 'medium',
    tags: ['interfaces', 'polymorphism'],
  },
  {
    id: 'go-008',
    language: 'go',
    title: 'Channel Patterns',
    description: 'Fan-out pattern with channels',
    code: `func fanOut(input <-chan int, workers int) []<-chan int {
  channels := make([]<-chan int, workers)
  for i := 0; i < workers; i++ {
    ch := make(chan int)
    channels[i] = ch
    go func(out chan<- int) {
      defer close(out)
      for val := range input {
        out <- val * val
      }
    }(ch)
  }
  return channels
}`,
    difficulty: 'medium',
    tags: ['channels', 'concurrency'],
  },
  {
    id: 'go-009',
    language: 'go',
    title: 'HTTP Handler',
    description: 'Basic HTTP server with JSON response',
    code: `func healthHandler(w http.ResponseWriter, r *http.Request) {
  if r.Method != http.MethodGet {
    http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
    return
  }
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(map[string]string{
    "status": "ok",
  })
}`,
    difficulty: 'medium',
    tags: ['http', 'web'],
  },
  {
    id: 'go-010',
    language: 'go',
    title: 'JSON Marshal',
    description: 'Struct serialization with JSON tags',
    code: `type User struct {
  ID        int       \`json:"id"\`\n  Name      string    \`json:"name"\`\n  Email     string    \`json:"email,omitempty"\`\n  CreatedAt time.Time \`json:"created_at"\`\n}\n\nfunc (u *User) ToJSON() ([]byte, error) {\n  return json.MarshalIndent(u, "", "  ")\n}`,
    difficulty: 'medium',
    tags: ['json', 'serialization'],
  },
  {
    id: 'go-011',
    language: 'go',
    title: 'Mutex Usage',
    description: 'Thread-safe counter with mutex',
    code: `type SafeCounter struct {
  mu sync.RWMutex
  v  map[string]int
}

func (c *SafeCounter) Inc(key string) {
  c.mu.Lock()
  defer c.mu.Unlock()
  c.v[key]++
}

func (c *SafeCounter) Get(key string) int {
  c.mu.RLock()
  defer c.mu.RUnlock()
  return c.v[key]
}`,
    difficulty: 'medium',
    tags: ['mutex', 'concurrency'],
  },
  {
    id: 'go-012',
    language: 'go',
    title: 'Context Usage',
    description: 'Using context for cancellation and timeouts',
    code: `func fetchData(ctx context.Context, url string) ([]byte, error) {
  ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
  defer cancel()

  req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
  if err != nil {
    return nil, err
  }

  resp, err := http.DefaultClient.Do(req)
  if err != nil {
    return nil, err
  }
  defer resp.Body.Close()
  return io.ReadAll(resp.Body)
}`,
    difficulty: 'medium',
    tags: ['context', 'http'],
  },
  {
    id: 'go-013',
    language: 'go',
    title: 'Generic Functions',
    description: 'Go generics with type constraints',
    code: `type Number interface {
  ~int | ~float64 | ~int64
}

func Sum[T Number](nums []T) T {
  var total T
  for _, n := range nums {
    total += n
  }
  return total
}

func Map[T any, U any](slice []T, fn func(T) U) []U {
  result := make([]U, len(slice))
  for i, v := range slice {
    result[i] = fn(v)
  }
  return result
}`,
    difficulty: 'hard',
    tags: ['generics', 'functional'],
  },
  {
    id: 'go-014',
    language: 'go',
    title: 'Worker Pool',
    description: 'Concurrent worker pool with channels',
    code: `func WorkerPool(jobs <-chan Job, results chan<- Result, workers int) {
  var wg sync.WaitGroup
  for i := 0; i < workers; i++ {
    wg.Add(1)
    go func(id int) {
      defer wg.Done()
      for job := range jobs {
        result := process(job)
        result.WorkerID = id
        results <- result
      }
    }(i)
  }
  go func() {
    wg.Wait()
    close(results)
  }()
}`,
    difficulty: 'hard',
    tags: ['concurrency', 'worker-pool'],
  },
  {
    id: 'go-015',
    language: 'go',
    title: 'Middleware Chain',
    description: 'HTTP middleware pattern with chaining',
    code: `type Middleware func(http.Handler) http.Handler

func Chain(h http.Handler, middlewares ...Middleware) http.Handler {
  for i := len(middlewares) - 1; i >= 0; i-- {
    h = middlewares[i](h)
  }
  return h
}

func Logging(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    start := time.Now()
    next.ServeHTTP(w, r)
    log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
  })
}`,
    difficulty: 'hard',
    tags: ['middleware', 'http', 'design-pattern'],
  },
  {
    id: 'go-016',
    language: 'go',
    title: 'Rate Limiter',
    description: 'Token bucket rate limiter',
    code: `type RateLimiter struct {
  tokens chan struct{}
  quit   chan struct{}
}

func NewRateLimiter(rate int, interval time.Duration) *RateLimiter {
  rl := &RateLimiter{
    tokens: make(chan struct{}, rate),
    quit:   make(chan struct{}),
  }
  go func() {
    ticker := time.NewTicker(interval / time.Duration(rate))
    defer ticker.Stop()
    for {
      select {
      case <-ticker.C:
        select {
        case rl.tokens <- struct{}{}:
        default:
        }
      case <-rl.quit:
        return
      }
    }
  }()
  return rl
}`,
    difficulty: 'hard',
    tags: ['rate-limiting', 'concurrency'],
  },
  {
    id: 'go-017',
    language: 'go',
    title: 'Concurrent Map',
    description: 'Generic thread-safe map using sync.RWMutex',
    code: `type ConcurrentMap[K comparable, V any] struct {
  mu sync.RWMutex
  m  map[K]V
}

func NewConcurrentMap[K comparable, V any]() *ConcurrentMap[K, V] {
  return &ConcurrentMap[K, V]{m: make(map[K]V)}
}

func (c *ConcurrentMap[K, V]) Set(key K, value V) {
  c.mu.Lock()
  defer c.mu.Unlock()
  c.m[key] = value
}

func (c *ConcurrentMap[K, V]) Get(key K) (V, bool) {
  c.mu.RLock()
  defer c.mu.RUnlock()
  v, ok := c.m[key]
  return v, ok
}`,
    difficulty: 'hard',
    tags: ['generics', 'concurrency'],
  },
  {
    id: 'go-018',
    language: 'go',
    title: 'gRPC-Style Handler',
    description: 'Unary RPC handler with interceptor pattern',
    code: `type UnaryHandler func(ctx context.Context, req interface{}) (interface{}, error)
type UnaryInterceptor func(ctx context.Context, req interface{}, handler UnaryHandler) (interface{}, error)

func ChainInterceptors(interceptors ...UnaryInterceptor) UnaryInterceptor {
  return func(ctx context.Context, req interface{}, handler UnaryHandler) (interface{}, error) {
    chain := handler
    for i := len(interceptors) - 1; i >= 0; i-- {
      next := chain
      interceptor := interceptors[i]
      chain = func(ctx context.Context, req interface{}) (interface{}, error) {
        return interceptor(ctx, req, next)
      }
    }
    return chain(ctx, req)
  }
}`,
    difficulty: 'hard',
    tags: ['grpc', 'design-pattern'],
  },
];

export default snippets;
