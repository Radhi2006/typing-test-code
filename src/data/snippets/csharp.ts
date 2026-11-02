import { CodeSnippet } from '../../types/snippet';

const snippets: CodeSnippet[] = [
  {
    id: 'cs-001',
    language: 'csharp',
    title: 'Auto Property',
    description: 'Class with auto-implemented properties',
    code: `public class Person
{
  public string Name { get; set; }
  public int Age { get; set; }
}`,
    difficulty: 'easy',
    tags: ['properties', 'class'],
  },
  {
    id: 'cs-002',
    language: 'csharp',
    title: 'LINQ Where Select',
    description: 'Filter and project a list using LINQ',
    code: `var adults = people
  .Where(p => p.Age >= 18)
  .Select(p => p.Name)
  .ToList();`,
    difficulty: 'easy',
    tags: ['linq', 'lambda'],
  },
  {
    id: 'cs-003',
    language: 'csharp',
    title: 'Record Type',
    description: 'Immutable record with positional parameters',
    code: `public record Point(double X, double Y)
{
  public double Distance => Math.Sqrt(X * X + Y * Y);
}`,
    difficulty: 'easy',
    tags: ['records', 'immutability'],
  },
  {
    id: 'cs-004',
    language: 'csharp',
    title: 'Simple Delegate',
    description: 'Define and invoke a delegate',
    code: `public delegate int MathOp(int a, int b);

MathOp add = (a, b) => a + b;
int result = add(3, 5);`,
    difficulty: 'easy',
    tags: ['delegates', 'lambda'],
  },
  {
    id: 'cs-005',
    language: 'csharp',
    title: 'Nullable Value Type',
    description: 'Using nullable int with null coalescing',
    code: `int? count = null;
int total = count ?? 0;
Console.WriteLine(total);`,
    difficulty: 'easy',
    tags: ['nullable', 'basics'],
  },
  {
    id: 'cs-006',
    language: 'csharp',
    title: 'Async File Read',
    description: 'Read file contents asynchronously',
    code: `public async Task<string> ReadFileAsync(string path)
{
  using var reader = new StreamReader(path);
  string content = await reader.ReadToEndAsync();
  return content;
}`,
    difficulty: 'medium',
    tags: ['async', 'file-io'],
  },
  {
    id: 'cs-007',
    language: 'csharp',
    title: 'Generic Repository',
    description: 'Generic interface for a data repository',
    code: `public interface IRepository<T> where T : class
{
  Task<T?> GetByIdAsync(int id);
  Task<IEnumerable<T>> GetAllAsync();
  Task AddAsync(T entity);
  Task UpdateAsync(T entity);
  Task DeleteAsync(int id);
}`,
    difficulty: 'medium',
    tags: ['generics', 'interface', 'repository'],
  },
  {
    id: 'cs-008',
    language: 'csharp',
    title: 'Event Publisher',
    description: 'Class with custom event and handler',
    code: `public class Button
{
  public event EventHandler<string>? Clicked;

  public void OnClick()
  {
    Clicked?.Invoke(this, "Button clicked");
  }
}`,
    difficulty: 'medium',
    tags: ['events', 'delegates'],
  },
  {
    id: 'cs-009',
    language: 'csharp',
    title: 'Extension Method',
    description: 'String extension to capitalize first letter',
    code: `public static class StringExtensions
{
  public static string Capitalize(this string str)
  {
    if (string.IsNullOrEmpty(str)) return str;
    return char.ToUpper(str[0]) + str[1..];
  }
}`,
    difficulty: 'medium',
    tags: ['extension-methods', 'string'],
  },
  {
    id: 'cs-010',
    language: 'csharp',
    title: 'LINQ GroupBy',
    description: 'Group items and aggregate with LINQ',
    code: `var summary = orders
  .GroupBy(o => o.Category)
  .Select(g => new
  {
    Category = g.Key,
    Total = g.Sum(o => o.Amount),
    Count = g.Count()
  })
  .OrderByDescending(x => x.Total);`,
    difficulty: 'medium',
    tags: ['linq', 'groupby', 'aggregation'],
  },
  {
    id: 'cs-011',
    language: 'csharp',
    title: 'Pattern Matching',
    description: 'Switch expression with pattern matching',
    code: `public static string Classify(object obj) => obj switch
{
  int n when n < 0 => "Negative",
  int n when n == 0 => "Zero",
  int n when n > 0 => "Positive",
  string s when s.Length == 0 => "Empty string",
  string s => \`$"String: {s}"\`,
  null => "Null",
  _ => "Unknown"
};`,
    difficulty: 'hard',
    tags: ['pattern-matching', 'switch'],
  },
  {
    id: 'cs-012',
    language: 'csharp',
    title: 'Dependency Injection Setup',
    description: 'Configure services with dependency injection',
    code: `public class Startup
{
  public void ConfigureServices(IServiceCollection services)
  {
    services.AddSingleton<ILogger, ConsoleLogger>();
    services.AddScoped<IUserRepository, UserRepository>();
    services.AddTransient<IEmailService, EmailService>();
    services.AddDbContext<AppDbContext>(options =>
      options.UseSqlServer(Configuration.GetConnectionString("Default")));
  }
}`,
    difficulty: 'hard',
    tags: ['dependency-injection', 'configuration'],
  },
  {
    id: 'cs-013',
    language: 'csharp',
    title: 'Async Parallel Tasks',
    description: 'Run multiple async tasks in parallel and await results',
    code: `public async Task<UserProfile> GetProfileAsync(int userId)
{
  var userTask = _userRepo.GetByIdAsync(userId);
  var ordersTask = _orderRepo.GetByUserAsync(userId);
  var prefsTask = _prefRepo.GetByUserAsync(userId);

  await Task.WhenAll(userTask, ordersTask, prefsTask);

  return new UserProfile
  {
    User = userTask.Result,
    Orders = ordersTask.Result,
    Preferences = prefsTask.Result
  };
}`,
    difficulty: 'hard',
    tags: ['async', 'parallel', 'tasks'],
  },
  {
    id: 'cs-014',
    language: 'csharp',
    title: 'Generic Constraint Method',
    description: 'Generic method with multiple type constraints',
    code: `public class Cache<TKey, TValue>
  where TKey : notnull
  where TValue : class, new()
{
  private readonly Dictionary<TKey, TValue> _store = new();

  public TValue GetOrCreate(TKey key)
  {
    if (!_store.TryGetValue(key, out var value))
    {
      value = new TValue();
      _store[key] = value;
    }
    return value;
  }
}`,
    difficulty: 'hard',
    tags: ['generics', 'constraints', 'cache'],
  },
  {
    id: 'cs-015',
    language: 'csharp',
    title: 'Record with Deconstruct',
    description: 'Record type with custom deconstruction and validation',
    code: `public record Temperature
{
  public double Celsius { get; init; }
  public double Fahrenheit => Celsius * 9.0 / 5.0 + 32;
  public double Kelvin => Celsius + 273.15;

  public Temperature(double celsius)
  {
    if (celsius < -273.15)
      throw new ArgumentException("Below absolute zero");
    Celsius = celsius;
  }

  public void Deconstruct(out double c, out double f, out double k)
    => (c, f, k) = (Celsius, Fahrenheit, Kelvin);
}`,
    difficulty: 'hard',
    tags: ['records', 'deconstruct', 'validation'],
  },
];

export default snippets;
