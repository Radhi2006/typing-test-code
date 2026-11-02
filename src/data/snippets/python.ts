import { CodeSnippet } from '../../types/snippet';

const snippets: CodeSnippet[] = [
  // ===== EASY (9) =====
  {
    id: 'py-001',
    language: 'python',
    title: 'Fibonacci',
    description: 'Recursive fibonacci function',
    code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`,
    difficulty: 'easy',
    tags: ['recursion', 'math'],
  },
  {
    id: 'py-002',
    language: 'python',
    title: 'List Comprehension',
    description: 'Various list comprehension patterns',
    code: `squares = [x ** 2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
flattened = [x for row in matrix for x in row]
pairs = [(x, y) for x in range(3) for y in range(3)]`,
    difficulty: 'easy',
    tags: ['list', 'comprehension'],
  },
  {
    id: 'py-003',
    language: 'python',
    title: 'Dictionary Merge',
    description: 'Merge dictionaries using different methods',
    code: `def merge_dicts(*dicts):
    result = {}
    for d in dicts:
        result.update(d)
    return result

merged = {**dict_a, **dict_b, **dict_c}`,
    difficulty: 'easy',
    tags: ['dictionary', 'utility'],
  },
  {
    id: 'py-004',
    language: 'python',
    title: 'Basic Decorator',
    description: 'Simple function decorator for logging',
    code: `def logger(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper`,
    difficulty: 'easy',
    tags: ['decorator', 'function'],
  },
  {
    id: 'py-005',
    language: 'python',
    title: 'Generator Function',
    description: 'Generator that yields fibonacci numbers',
    code: `def fib_generator(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b`,
    difficulty: 'easy',
    tags: ['generator', 'iterator'],
  },
  {
    id: 'py-006',
    language: 'python',
    title: 'Class Init',
    description: 'Class with init and string representation',
    code: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    def distance_to(self, other):
        return ((self.x - other.x) ** 2 + (self.y - other.y) ** 2) ** 0.5`,
    difficulty: 'easy',
    tags: ['class', 'oop'],
  },
  {
    id: 'py-007',
    language: 'python',
    title: 'Lambda Filter',
    description: 'Filter and map using lambda functions',
    code: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens = list(filter(lambda x: x % 2 == 0, numbers))
squared = list(map(lambda x: x ** 2, numbers))
sorted_items = sorted(items, key=lambda x: x["score"], reverse=True)`,
    difficulty: 'easy',
    tags: ['lambda', 'functional'],
  },
  {
    id: 'py-008',
    language: 'python',
    title: 'String Reverse',
    description: 'Reverse a string using slicing',
    code: `def reverse_string(s):
    return s[::-1]

def is_palindrome(s):
    cleaned = s.lower().replace(" ", "")
    return cleaned == cleaned[::-1]`,
    difficulty: 'easy',
    tags: ['string', 'slicing'],
  },
  {
    id: 'py-009',
    language: 'python',
    title: 'File Reader',
    description: 'Read file contents safely with context manager',
    code: `def read_file(filepath):
    try:
        with open(filepath, "r") as f:
            return f.read()
    except FileNotFoundError:
        return None
    except IOError as e:
        print(f"Error reading file: {e}")
        return None`,
    difficulty: 'easy',
    tags: ['file', 'error-handling'],
  },

  // ===== MEDIUM (9) =====
  {
    id: 'py-010',
    language: 'python',
    title: 'Context Manager',
    description: 'Custom context manager for timing code blocks',
    code: `import time

class Timer:
    def __init__(self, label="Block"):
        self.label = label
        self.elapsed = 0

    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.elapsed = time.perf_counter() - self.start
        print(f"{self.label} took {self.elapsed:.4f}s")
        return False`,
    difficulty: 'medium',
    tags: ['context-manager', 'class'],
  },
  {
    id: 'py-011',
    language: 'python',
    title: 'Binary Search Tree',
    description: 'BST with insert and search operations',
    code: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        if not self.root:
            self.root = TreeNode(val)
        else:
            self._insert(self.root, val)

    def _insert(self, node, val):
        if val < node.val:
            if node.left is None:
                node.left = TreeNode(val)
            else:
                self._insert(node.left, val)
        else:
            if node.right is None:
                node.right = TreeNode(val)
            else:
                self._insert(node.right, val)`,
    difficulty: 'medium',
    tags: ['data-structure', 'tree', 'recursion'],
  },
  {
    id: 'py-012',
    language: 'python',
    title: 'LRU Cache',
    description: 'LRU cache using OrderedDict',
    code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)`,
    difficulty: 'medium',
    tags: ['cache', 'data-structure'],
  },
  {
    id: 'py-013',
    language: 'python',
    title: 'Async Fetch',
    description: 'Async HTTP requests with aiohttp',
    code: `import aiohttp
import asyncio

async def fetch(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

async def fetch_all(urls):
    tasks = [fetch(url) for url in urls]
    return await asyncio.gather(*tasks)`,
    difficulty: 'medium',
    tags: ['async', 'http'],
  },
  {
    id: 'py-014',
    language: 'python',
    title: 'Dataclass',
    description: 'Dataclass with validation and custom methods',
    code: `from dataclasses import dataclass, field

@dataclass
class Product:
    name: str
    price: float
    quantity: int = 0
    tags: list[str] = field(default_factory=list)

    @property
    def total_value(self) -> float:
        return self.price * self.quantity

    def __post_init__(self):
        if self.price < 0:
            raise ValueError("Price cannot be negative")`,
    difficulty: 'medium',
    tags: ['dataclass', 'oop'],
  },
  {
    id: 'py-015',
    language: 'python',
    title: 'Abstract Class',
    description: 'Abstract base class with abstract methods',
    code: `from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass

    @abstractmethod
    def perimeter(self) -> float:
        pass

class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        return 3.14159 * self.radius ** 2

    def perimeter(self) -> float:
        return 2 * 3.14159 * self.radius`,
    difficulty: 'medium',
    tags: ['abstract', 'oop', 'inheritance'],
  },
  {
    id: 'py-016',
    language: 'python',
    title: 'Decorator with Args',
    description: 'Decorator factory that accepts arguments',
    code: `import functools

def retry(max_attempts=3, delay=1):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator`,
    difficulty: 'medium',
    tags: ['decorator', 'error-handling'],
  },
  {
    id: 'py-017',
    language: 'python',
    title: 'Generator Pipeline',
    description: 'Chain generators for data processing pipeline',
    code: `def read_lines(filename):
    with open(filename) as f:
        for line in f:
            yield line.strip()

def filter_comments(lines):
    for line in lines:
        if not line.startswith("#"):
            yield line

def to_upper(lines):
    for line in lines:
        yield line.upper()

pipeline = to_upper(filter_comments(read_lines("data.txt")))`,
    difficulty: 'medium',
    tags: ['generator', 'pipeline', 'functional'],
  },
  {
    id: 'py-018',
    language: 'python',
    title: 'Graph BFS',
    description: 'Breadth-first search on an adjacency list graph',
    code: `from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    result = []
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return result`,
    difficulty: 'medium',
    tags: ['graph', 'algorithm', 'bfs'],
  },

  // ===== HARD (7) =====
  {
    id: 'py-019',
    language: 'python',
    title: 'Metaclass',
    description: 'Metaclass that enforces interface implementation',
    code: `class InterfaceMeta(type):
    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        if bases:
            required = getattr(cls, "_required_methods", [])
            for method in required:
                if method not in namespace:
                    raise TypeError(
                        f"{name} must implement {method}"
                    )
        return cls

class Serializable(metaclass=InterfaceMeta):
    _required_methods = ["serialize", "deserialize"]`,
    difficulty: 'hard',
    tags: ['metaclass', 'oop', 'advanced'],
  },
  {
    id: 'py-020',
    language: 'python',
    title: 'Descriptor Protocol',
    description: 'Custom descriptor for type-checked attributes',
    code: `class TypeChecked:
    def __init__(self, name, expected_type):
        self.name = name
        self.expected_type = expected_type

    def __set_name__(self, owner, name):
        self.name = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return obj.__dict__.get(self.name)

    def __set__(self, obj, value):
        if not isinstance(value, self.expected_type):
            raise TypeError(
                f"{self.name} must be {self.expected_type.__name__}"
            )
        obj.__dict__[self.name] = value`,
    difficulty: 'hard',
    tags: ['descriptor', 'oop', 'validation'],
  },
  {
    id: 'py-021',
    language: 'python',
    title: 'Async Generator',
    description: 'Async generator for streaming paginated API data',
    code: `import aiohttp

async def paginate(base_url, max_pages=None):
    page = 1
    async with aiohttp.ClientSession() as session:
        while True:
            url = f"{base_url}?page={page}"
            async with session.get(url) as resp:
                data = await resp.json()
                if not data["results"]:
                    break
                for item in data["results"]:
                    yield item
                if max_pages and page >= max_pages:
                    break
                page += 1`,
    difficulty: 'hard',
    tags: ['async', 'generator', 'api'],
  },
  {
    id: 'py-022',
    language: 'python',
    title: 'Generic Type Hints',
    description: 'Generic classes and protocols with type hints',
    code: `from typing import TypeVar, Generic, Protocol

T = TypeVar("T")

class Comparable(Protocol):
    def __lt__(self, other) -> bool: ...

def min_value(items: list[T]) -> T:
    return min(items)

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        if not self._items:
            raise IndexError("Stack is empty")
        return self._items.pop()`,
    difficulty: 'hard',
    tags: ['typing', 'generics', 'protocol'],
  },
  {
    id: 'py-023',
    language: 'python',
    title: 'Coroutine Scheduler',
    description: 'Simple cooperative task scheduler using generators',
    code: `from collections import deque

class Scheduler:
    def __init__(self):
        self.ready = deque()
        self.task_map = {}
        self.task_id = 0

    def new_task(self, coroutine):
        self.task_id += 1
        self.task_map[self.task_id] = coroutine
        self.ready.append(self.task_id)
        return self.task_id

    def run(self):
        while self.ready:
            tid = self.ready.popleft()
            task = self.task_map[tid]
            try:
                next(task)
                self.ready.append(tid)
            except StopIteration:
                del self.task_map[tid]`,
    difficulty: 'hard',
    tags: ['coroutine', 'scheduler', 'concurrency'],
  },
  {
    id: 'py-024',
    language: 'python',
    title: 'Trie Implementation',
    description: 'Trie data structure for prefix-based search',
    code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def search(self, word):
        node = self._find(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._find(prefix) is not None

    def _find(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node`,
    difficulty: 'hard',
    tags: ['data-structure', 'trie', 'string'],
  },
  {
    id: 'py-025',
    language: 'python',
    title: 'A* Pathfinding',
    description: 'A* search algorithm for grid pathfinding',
    code: `import heapq

def astar(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    open_set = [(0, start)]
    came_from = {}
    g_score = {start: 0}

    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])

    while open_set:
        _, current = heapq.heappop(open_set)
        if current == end:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            return path[::-1]
        for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            nx, ny = current[0] + dx, current[1] + dy
            if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == 0:
                ng = g_score[current] + 1
                if ng < g_score.get((nx, ny), float("inf")):
                    came_from[(nx, ny)] = current
                    g_score[(nx, ny)] = ng
                    heapq.heappush(open_set, (ng + heuristic((nx, ny), end), (nx, ny)))
    return []`,
    difficulty: 'hard',
    tags: ['algorithm', 'pathfinding', 'graph'],
  },
];

export default snippets;
