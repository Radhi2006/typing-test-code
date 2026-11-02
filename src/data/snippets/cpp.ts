import { CodeSnippet } from '../../types/snippet';

const snippets: CodeSnippet[] = [
  {
    id: 'cpp-001',
    language: 'cpp',
    title: 'Hello World',
    description: 'Basic C++ program with iostream',
    code: `#include <iostream>

int main() {
  std::cout << "Hello, World!" << std::endl;
  return 0;
}`,
    difficulty: 'easy',
    tags: ['basics', 'io'],
  },
  {
    id: 'cpp-002',
    language: 'cpp',
    title: 'Vector Operations',
    description: 'Common std::vector operations',
    code: `std::vector<int> nums = {3, 1, 4, 1, 5};
nums.push_back(9);
std::sort(nums.begin(), nums.end());
nums.erase(std::unique(nums.begin(), nums.end()), nums.end());
int size = nums.size();`,
    difficulty: 'easy',
    tags: ['stl', 'vector'],
  },
  {
    id: 'cpp-003',
    language: 'cpp',
    title: 'String Manipulation',
    description: 'Common string operations in C++',
    code: `std::string text = "Hello, World!";
std::string upper = text;
std::transform(upper.begin(), upper.end(), upper.begin(), ::toupper);
size_t pos = text.find("World");
std::string sub = text.substr(0, 5);`,
    difficulty: 'easy',
    tags: ['strings', 'stl'],
  },
  {
    id: 'cpp-004',
    language: 'cpp',
    title: 'Pointer Basics',
    description: 'Raw pointer declaration and dereferencing',
    code: `int value = 42;
int* ptr = &value;
int deref = *ptr;
*ptr = 100;
std::cout << "Value: " << value << std::endl;`,
    difficulty: 'easy',
    tags: ['pointers', 'basics'],
  },
  {
    id: 'cpp-005',
    language: 'cpp',
    title: 'Struct Definition',
    description: 'Simple struct with member function',
    code: `struct Point {
  double x;
  double y;

  double distance(const Point& other) const {
    double dx = x - other.x;
    double dy = y - other.y;
    return std::sqrt(dx * dx + dy * dy);
  }
};`,
    difficulty: 'easy',
    tags: ['struct', 'basics'],
  },
  {
    id: 'cpp-006',
    language: 'cpp',
    title: 'Template Function',
    description: 'Generic max function using templates',
    code: `template <typename T>
T maxValue(T a, T b) {
  return (a > b) ? a : b;
}`,
    difficulty: 'easy',
    tags: ['templates', 'functions'],
  },
  {
    id: 'cpp-007',
    language: 'cpp',
    title: 'Range-Based For',
    description: 'Modern C++ range-based for loop with auto',
    code: `std::map<std::string, int> scores = {{"Alice", 95}, {"Bob", 87}};
for (const auto& [name, score] : scores) {
  std::cout << name << ": " << score << std::endl;
}`,
    difficulty: 'easy',
    tags: ['loops', 'modern-cpp'],
  },
  {
    id: 'cpp-008',
    language: 'cpp',
    title: 'Class with RAII',
    description: 'Resource management using RAII pattern',
    code: `class FileHandle {
public:
  explicit FileHandle(const std::string& path)
    : file_(std::fopen(path.c_str(), "r")) {
    if (!file_) throw std::runtime_error("Cannot open file");
  }

  ~FileHandle() {
    if (file_) std::fclose(file_);
  }

  FileHandle(const FileHandle&) = delete;
  FileHandle& operator=(const FileHandle&) = delete;

private:
  FILE* file_;
};`,
    difficulty: 'medium',
    tags: ['raii', 'class', 'resource-management'],
  },
  {
    id: 'cpp-009',
    language: 'cpp',
    title: 'Smart Pointers',
    description: 'Using shared_ptr and unique_ptr',
    code: `auto unique = std::make_unique<std::string>("hello");
auto shared = std::make_shared<std::vector<int>>();
shared->push_back(1);
shared->push_back(2);

std::shared_ptr<std::vector<int>> copy = shared;
std::cout << "Use count: " << shared.use_count() << std::endl;
std::cout << "Size: " << copy->size() << std::endl;`,
    difficulty: 'medium',
    tags: ['smart-pointers', 'memory'],
  },
  {
    id: 'cpp-010',
    language: 'cpp',
    title: 'Template Class',
    description: 'Generic stack implementation with templates',
    code: `template <typename T, size_t MaxSize = 100>
class Stack {
public:
  void push(const T& value) {
    if (size_ >= MaxSize) throw std::overflow_error("Stack full");
    data_[size_++] = value;
  }

  T pop() {
    if (size_ == 0) throw std::underflow_error("Stack empty");
    return data_[--size_];
  }

  bool empty() const { return size_ == 0; }

private:
  T data_[MaxSize];
  size_t size_ = 0;
};`,
    difficulty: 'medium',
    tags: ['templates', 'data-structure'],
  },
  {
    id: 'cpp-011',
    language: 'cpp',
    title: 'Operator Overloading',
    description: 'Overloading arithmetic and stream operators',
    code: `class Vec2 {
public:
  double x, y;
  Vec2(double x, double y) : x(x), y(y) {}

  Vec2 operator+(const Vec2& o) const { return {x + o.x, y + o.y}; }
  Vec2 operator*(double s) const { return {x * s, y * s}; }

  friend std::ostream& operator<<(std::ostream& os, const Vec2& v) {
    return os << "(" << v.x << ", " << v.y << ")";
  }
};`,
    difficulty: 'medium',
    tags: ['operators', 'class'],
  },
  {
    id: 'cpp-012',
    language: 'cpp',
    title: 'STL Algorithms',
    description: 'Using standard library algorithms',
    code: `std::vector<int> nums = {5, 3, 8, 1, 9, 2, 7};
auto it = std::find(nums.begin(), nums.end(), 8);
int count = std::count_if(nums.begin(), nums.end(),
  [](int n) { return n > 5; });
std::vector<int> squared(nums.size());
std::transform(nums.begin(), nums.end(), squared.begin(),
  [](int n) { return n * n; });`,
    difficulty: 'medium',
    tags: ['stl', 'algorithms'],
  },
  {
    id: 'cpp-013',
    language: 'cpp',
    title: 'Lambda Expressions',
    description: 'Lambdas with captures and std::function',
    code: `int multiplier = 3;
auto multiply = [multiplier](int x) { return x * multiplier; };

std::vector<int> nums = {1, 2, 3, 4, 5};
std::vector<int> result;
std::transform(nums.begin(), nums.end(),
  std::back_inserter(result), multiply);

auto adder = [sum = 0](int x) mutable { sum += x; return sum; };`,
    difficulty: 'medium',
    tags: ['lambda', 'functional'],
  },
  {
    id: 'cpp-014',
    language: 'cpp',
    title: 'Move Semantics',
    description: 'Move constructor and move assignment',
    code: `class Buffer {
public:
  Buffer(size_t size) : data_(new int[size]), size_(size) {}
  ~Buffer() { delete[] data_; }

  Buffer(Buffer&& other) noexcept
    : data_(other.data_), size_(other.size_) {
    other.data_ = nullptr;
    other.size_ = 0;
  }

  Buffer& operator=(Buffer&& other) noexcept {
    if (this != &other) {
      delete[] data_;
      data_ = other.data_;
      size_ = other.size_;
      other.data_ = nullptr;
      other.size_ = 0;
    }
    return *this;
  }

private:
  int* data_;
  size_t size_;
};`,
    difficulty: 'medium',
    tags: ['move-semantics', 'modern-cpp'],
  },
  {
    id: 'cpp-015',
    language: 'cpp',
    title: 'Template Metaprogramming',
    description: 'Compile-time factorial using template metaprogramming',
    code: `template <unsigned N>
struct Factorial {
  static constexpr unsigned value = N * Factorial<N - 1>::value;
};

template <>
struct Factorial<0> {
  static constexpr unsigned value = 1;
};

template <unsigned N>
constexpr bool is_even = (Factorial<N>::value % 2 == 0);

static_assert(Factorial<5>::value == 120);
static_assert(is_even<3>);`,
    difficulty: 'hard',
    tags: ['templates', 'metaprogramming'],
  },
  {
    id: 'cpp-016',
    language: 'cpp',
    title: 'Variadic Templates',
    description: 'Type-safe printf using variadic templates',
    code: `template <typename T>
void print(const T& value) {
  std::cout << value << std::endl;
}

template <typename T, typename... Args>
void print(const T& first, const Args&... rest) {
  std::cout << first << " ";
  print(rest...);
}

template <typename... Args>
auto sum(Args... args) {
  return (args + ...);
}`,
    difficulty: 'hard',
    tags: ['templates', 'variadic'],
  },
  {
    id: 'cpp-017',
    language: 'cpp',
    title: 'CRTP Pattern',
    description: 'Curiously Recurring Template Pattern for static polymorphism',
    code: `template <typename Derived>
class Shape {
public:
  double area() const {
    return static_cast<const Derived*>(this)->areaImpl();
  }
  void draw() const {
    static_cast<const Derived*>(this)->drawImpl();
  }
};

class Circle : public Shape<Circle> {
  double radius_;
public:
  Circle(double r) : radius_(r) {}
  double areaImpl() const { return 3.14159 * radius_ * radius_; }
  void drawImpl() const { std::cout << "Circle r=" << radius_; }
};`,
    difficulty: 'hard',
    tags: ['crtp', 'design-pattern', 'templates'],
  },
  {
    id: 'cpp-018',
    language: 'cpp',
    title: 'Thread-Safe Singleton',
    description: 'Meyer\'s singleton with thread safety',
    code: `class Logger {
public:
  static Logger& instance() {
    static Logger inst;
    return inst;
  }

  void log(const std::string& msg) {
    std::lock_guard<std::mutex> lock(mutex_);
    std::cout << "[LOG] " << msg << std::endl;
  }

  Logger(const Logger&) = delete;
  Logger& operator=(const Logger&) = delete;

private:
  Logger() = default;
  std::mutex mutex_;
};`,
    difficulty: 'hard',
    tags: ['singleton', 'concurrency', 'design-pattern'],
  },
  {
    id: 'cpp-019',
    language: 'cpp',
    title: 'Custom Iterator',
    description: 'Forward iterator for a linked list',
    code: `template <typename T>
class LinkedList {
  struct Node { T data; Node* next; };
  Node* head_ = nullptr;
public:
  class Iterator {
    Node* current_;
  public:
    explicit Iterator(Node* node) : current_(node) {}
    T& operator*() { return current_->data; }
    Iterator& operator++() { current_ = current_->next; return *this; }
    bool operator!=(const Iterator& o) const {
      return current_ != o.current_;
    }
  };

  Iterator begin() { return Iterator(head_); }
  Iterator end() { return Iterator(nullptr); }
};`,
    difficulty: 'hard',
    tags: ['iterator', 'data-structure'],
  },
  {
    id: 'cpp-020',
    language: 'cpp',
    title: 'Memory Pool',
    description: 'Simple fixed-size memory pool allocator',
    code: `template <typename T, size_t BlockSize = 1024>
class MemoryPool {
  union Block {
    T data;
    Block* next;
  };
  Block* free_ = nullptr;
  std::vector<std::unique_ptr<Block[]>> chunks_;

public:
  T* allocate() {
    if (!free_) {
      auto chunk = std::make_unique<Block[]>(BlockSize);
      for (size_t i = 0; i < BlockSize - 1; ++i)
        chunk[i].next = &chunk[i + 1];
      chunk[BlockSize - 1].next = nullptr;
      free_ = &chunk[0];
      chunks_.push_back(std::move(chunk));
    }
    Block* block = free_;
    free_ = free_->next;
    return &block->data;
  }

  void deallocate(T* ptr) {
    auto block = reinterpret_cast<Block*>(ptr);
    block->next = free_;
    free_ = block;
  }
};`,
    difficulty: 'hard',
    tags: ['memory', 'allocator', 'performance'],
  },
];

export default snippets;
