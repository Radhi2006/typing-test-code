import { CodeSnippet } from '../../types/snippet';

const snippets: CodeSnippet[] = [
  // ===== EASY (9) =====
  {
    id: 'ts-001',
    language: 'typescript',
    title: 'Generic Identity',
    description: 'Generic identity function with type parameter',
    code: `function identity<T>(value: T): T {
  return value;
}`,
    difficulty: 'easy',
    tags: ['generics', 'function'],
  },
  {
    id: 'ts-002',
    language: 'typescript',
    title: 'Typed Array Filter',
    description: 'Filter an array with type-safe predicate',
    code: `function filterArray<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

const evens = filterArray([1, 2, 3, 4, 5], n => n % 2 === 0);`,
    difficulty: 'easy',
    tags: ['generics', 'array'],
  },
  {
    id: 'ts-003',
    language: 'typescript',
    title: 'Interface Definition',
    description: 'Define a User interface with optional fields',
    code: `interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  readonly createdAt: Date;
}`,
    difficulty: 'easy',
    tags: ['interface', 'types'],
  },
  {
    id: 'ts-004',
    language: 'typescript',
    title: 'Enum Usage',
    description: 'Define and use a string enum for status',
    code: `enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
}

function isActive(status: Status): boolean {
  return status === Status.Active;
}`,
    difficulty: 'easy',
    tags: ['enum', 'types'],
  },
  {
    id: 'ts-005',
    language: 'typescript',
    title: 'Type Guard',
    description: 'Type guard function for narrowing types',
    code: `function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(value: string | number): string {
  if (isString(value)) return value.toUpperCase();
  return value.toFixed(2);
}`,
    difficulty: 'easy',
    tags: ['type-guard', 'narrowing'],
  },
  {
    id: 'ts-006',
    language: 'typescript',
    title: 'Tuple Type',
    description: 'Define and use a labeled tuple type',
    code: `type Coordinate = [x: number, y: number, z?: number];

function distance(a: Coordinate, b: Coordinate): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}`,
    difficulty: 'easy',
    tags: ['tuple', 'types'],
  },
  {
    id: 'ts-007',
    language: 'typescript',
    title: 'Readonly Array',
    description: 'Use readonly arrays for immutable data',
    code: `function freezeArray<T>(arr: T[]): ReadonlyArray<T> {
  return Object.freeze([...arr]);
}

const items: readonly number[] = freezeArray([1, 2, 3]);`,
    difficulty: 'easy',
    tags: ['readonly', 'array'],
  },
  {
    id: 'ts-008',
    language: 'typescript',
    title: 'Optional Chaining Helper',
    description: 'Safe nested property access with types',
    code: `interface Config {
  db?: { host?: string; port?: number };
  cache?: { ttl?: number };
}

function getDbHost(config: Config): string {
  return config.db?.host ?? 'localhost';
}`,
    difficulty: 'easy',
    tags: ['optional-chaining', 'interface'],
  },
  {
    id: 'ts-009',
    language: 'typescript',
    title: 'Mapped Type',
    description: 'Create a mapped type to make all properties optional',
    code: `type Optional<T> = {
  [K in keyof T]?: T[K];
};

type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};`,
    difficulty: 'easy',
    tags: ['mapped-types', 'utility-types'],
  },

  // ===== MEDIUM (9) =====
  {
    id: 'ts-010',
    language: 'typescript',
    title: 'Generic Stack',
    description: 'Type-safe stack data structure',
    code: `class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }
  pop(): T | undefined {
    return this.items.pop();
  }
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  get size(): number {
    return this.items.length;
  }
}`,
    difficulty: 'medium',
    tags: ['generics', 'data-structure', 'class'],
  },
  {
    id: 'ts-011',
    language: 'typescript',
    title: 'Typed Event Emitter',
    description: 'Type-safe event emitter with event map',
    code: `type EventMap = Record<string, unknown[]>;

class TypedEmitter<T extends EventMap> {
  private listeners: { [K in keyof T]?: Array<(...args: T[K]) => void> } = {};

  on<K extends keyof T>(event: K, listener: (...args: T[K]) => void): void {
    (this.listeners[event] ??= []).push(listener);
  }
  emit<K extends keyof T>(event: K, ...args: T[K]): void {
    this.listeners[event]?.forEach(fn => fn(...args));
  }
}`,
    difficulty: 'medium',
    tags: ['generics', 'events', 'class'],
  },
  {
    id: 'ts-012',
    language: 'typescript',
    title: 'Builder Pattern',
    description: 'Fluent builder pattern with type safety',
    code: `class QueryBuilder {
  private table: string = '';
  private conditions: string[] = [];
  private limit?: number;

  from(table: string): this {
    this.table = table;
    return this;
  }
  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }
  take(limit: number): this {
    this.limit = limit;
    return this;
  }
  build(): string {
    let query = \`SELECT * FROM \${this.table}\`;\n    if (this.conditions.length) query += \` WHERE \${this.conditions.join(' AND ')}\`;\n    if (this.limit) query += \` LIMIT \${this.limit}\`;\n    return query;\n  }\n}`,
    difficulty: 'medium',
    tags: ['pattern', 'class'],
  },
  {
    id: 'ts-013',
    language: 'typescript',
    title: 'Result Type',
    description: 'Rust-inspired Result type for error handling',
    code: `type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function tryCatch<T>(fn: () => T): Result<T> {
  try {
    return { ok: true, value: fn() };
  } catch (err) {
    return { ok: false, error: err as Error };
  }
}`,
    difficulty: 'medium',
    tags: ['types', 'error-handling'],
  },
  {
    id: 'ts-014',
    language: 'typescript',
    title: 'Generic Repository',
    description: 'Generic CRUD repository interface',
    code: `interface Entity {
  id: string;
}

interface Repository<T extends Entity> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}`,
    difficulty: 'medium',
    tags: ['generics', 'interface', 'pattern'],
  },
  {
    id: 'ts-015',
    language: 'typescript',
    title: 'Pipe Function',
    description: 'Type-safe function composition with pipe',
    code: `function pipe<A, B>(fn1: (a: A) => B): (a: A) => B;
function pipe<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C;
function pipe<A, B, C, D>(fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D): (a: A) => D;
function pipe(...fns: Function[]): Function {
  return (x: unknown) => fns.reduce((v, f) => f(v), x);
}`,
    difficulty: 'medium',
    tags: ['functional', 'overloads'],
  },
  {
    id: 'ts-016',
    language: 'typescript',
    title: 'Type-Safe Fetch',
    description: 'Typed wrapper around the fetch API',
    code: `async function typedFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);\n  }\n  return response.json() as Promise<T>;\n}\n\ninterface ApiResponse<T> {\n  data: T;\n  message: string;\n}`,
    difficulty: 'medium',
    tags: ['async', 'fetch', 'generics'],
  },
  {
    id: 'ts-017',
    language: 'typescript',
    title: 'Discriminated Union',
    description: 'Discriminated union for shape area calculation',
    code: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'rectangle': return shape.width * shape.height;
    case 'triangle': return (shape.base * shape.height) / 2;
  }
}`,
    difficulty: 'medium',
    tags: ['union', 'pattern-matching'],
  },
  {
    id: 'ts-018',
    language: 'typescript',
    title: 'Decorator Pattern',
    description: 'Method decorator for logging execution time',
    code: `function logTime(
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    const start = performance.now();
    const result = original.apply(this, args);
    const end = performance.now();
    console.log(\`\${propertyKey} took \${(end - start).toFixed(2)}ms\`);\n    return result;\n  };\n  return descriptor;\n}`,
    difficulty: 'medium',
    tags: ['decorator', 'pattern'],
  },

  // ===== HARD (7) =====
  {
    id: 'ts-019',
    language: 'typescript',
    title: 'Generic Linked List',
    description: 'Type-safe linked list with iterator support',
    code: `class ListNode<T> {
  constructor(public value: T, public next: ListNode<T> | null = null) {}
}

class LinkedList<T> {
  private head: ListNode<T> | null = null;

  prepend(value: T): void {
    this.head = new ListNode(value, this.head);
  }
  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
  find(predicate: (value: T) => boolean): T | undefined {
    for (const value of this) {
      if (predicate(value)) return value;
    }
    return undefined;
  }
}`,
    difficulty: 'hard',
    tags: ['generics', 'data-structure', 'iterator'],
  },
  {
    id: 'ts-020',
    language: 'typescript',
    title: 'Type-Safe State Machine',
    description: 'State machine with typed transitions',
    code: `type Transitions<S extends string, E extends string> = {
  [K in S]?: { [J in E]?: S };
};

class StateMachine<S extends string, E extends string> {
  constructor(
    private state: S,
    private transitions: Transitions<S, E>
  ) {}
  send(event: E): S {
    const next = this.transitions[this.state]?.[event];
    if (!next) throw new Error(\`No transition from \${this.state} on \${event}\`);\n    this.state = next;\n    return this.state;\n  }\n  getState(): S {\n    return this.state;\n  }\n}`,
    difficulty: 'hard',
    tags: ['generics', 'pattern', 'state-machine'],
  },
  {
    id: 'ts-021',
    language: 'typescript',
    title: 'Dependency Injection Container',
    description: 'Simple DI container with type-safe resolution',
    code: `class Container {
  private registry = new Map<string, { factory: () => unknown; singleton: boolean }>();
  private instances = new Map<string, unknown>();

  register<T>(token: string, factory: () => T, singleton = true): void {
    this.registry.set(token, { factory, singleton });
  }
  resolve<T>(token: string): T {
    if (this.instances.has(token)) return this.instances.get(token) as T;
    const entry = this.registry.get(token);
    if (!entry) throw new Error(\`No provider for \${token}\`);\n    const instance = entry.factory() as T;\n    if (entry.singleton) this.instances.set(token, instance);\n    return instance;\n  }\n}`,
    difficulty: 'hard',
    tags: ['pattern', 'dependency-injection', 'class'],
  },
  {
    id: 'ts-022',
    language: 'typescript',
    title: 'Type-Safe Router',
    description: 'Type-safe route definitions with params extraction',
    code: `type ExtractParams<T extends string> =
  T extends \`\${string}:\${infer Param}/\${infer Rest}\`\n    ? { [K in Param | keyof ExtractParams<Rest>]: string }\n    : T extends \`\${string}:\${infer Param}\`\n    ? { [K in Param]: string }\n    : {};\n\ninterface Route<P extends string> {\n  path: P;\n  handler: (params: ExtractParams<P>) => void;\n}\n\nfunction route<P extends string>(path: P, handler: (params: ExtractParams<P>) => void): Route<P> {\n  return { path, handler };\n}`,
    difficulty: 'hard',
    tags: ['generics', 'template-literal', 'routing'],
  },
  {
    id: 'ts-023',
    language: 'typescript',
    title: 'Advanced Mapped Types',
    description: 'Deep partial and deep readonly utility types',
    code: `type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T;

type DeepRequired<T> = T extends object
  ? { [P in keyof T]-?: DeepRequired<T[P]> }
  : T;`,
    difficulty: 'hard',
    tags: ['mapped-types', 'utility-types', 'recursive'],
  },
  {
    id: 'ts-024',
    language: 'typescript',
    title: 'Conditional Types Utility',
    description: 'Advanced conditional types for type manipulation',
    code: `type IsArray<T> = T extends unknown[] ? true : false;
type UnwrapPromise<T> = T extends Promise<infer U> ? UnwrapPromise<U> : T;

type FunctionArgs<T> = T extends (...args: infer A) => unknown ? A : never;
type FunctionReturn<T> = T extends (...args: unknown[]) => infer R ? R : never;

type Awaited<T> = T extends Promise<infer U>
  ? U extends Promise<unknown>
    ? Awaited<U>
    : U
  : T;`,
    difficulty: 'hard',
    tags: ['conditional-types', 'utility-types'],
  },
  {
    id: 'ts-025',
    language: 'typescript',
    title: 'Generic Middleware',
    description: 'Type-safe middleware pipeline with context',
    code: `type Middleware<T> = (context: T, next: () => Promise<void>) => Promise<void>;

class Pipeline<T> {
  private middlewares: Middleware<T>[] = [];

  use(middleware: Middleware<T>): this {
    this.middlewares.push(middleware);
    return this;
  }
  async execute(context: T): Promise<void> {
    const run = (index: number): Promise<void> => {
      if (index >= this.middlewares.length) return Promise.resolve();
      return this.middlewares[index](context, () => run(index + 1));
    };
    return run(0);
  }
}`,
    difficulty: 'hard',
    tags: ['generics', 'middleware', 'async'],
  },
];

export default snippets;
