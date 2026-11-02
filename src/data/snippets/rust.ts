import { CodeSnippet } from '../../types/snippet';

const snippets: CodeSnippet[] = [
  {
    id: 'rust-001',
    language: 'rust',
    title: 'Hello World',
    description: 'Basic Rust program with main function',
    code: `fn main() {
  println!("Hello, World!");
}`,
    difficulty: 'easy',
    tags: ['basics'],
  },
  {
    id: 'rust-002',
    language: 'rust',
    title: 'Vector Operations',
    description: 'Common Vec operations in Rust',
    code: `let mut nums: Vec<i32> = vec![1, 2, 3, 4, 5];
nums.push(6);
nums.retain(|&x| x > 2);
let sum: i32 = nums.iter().sum();
println!("Sum: {}", sum);`,
    difficulty: 'easy',
    tags: ['vectors', 'collections'],
  },
  {
    id: 'rust-003',
    language: 'rust',
    title: 'String Operations',
    description: 'String and &str manipulation',
    code: `let greeting = String::from("Hello, World!");
let upper = greeting.to_uppercase();
let contains = greeting.contains("World");
let replaced = greeting.replace("World", "Rust");
println!("{}", replaced);`,
    difficulty: 'easy',
    tags: ['strings', 'basics'],
  },
  {
    id: 'rust-004',
    language: 'rust',
    title: 'Struct Impl',
    description: 'Struct with implementation block',
    code: `struct Rectangle {
  width: f64,
  height: f64,
}

impl Rectangle {
  fn new(width: f64, height: f64) -> Self {
    Self { width, height }
  }

  fn area(&self) -> f64 {
    self.width * self.height
  }
}`,
    difficulty: 'easy',
    tags: ['structs', 'methods'],
  },
  {
    id: 'rust-005',
    language: 'rust',
    title: 'Enum Matching',
    description: 'Pattern matching on enums',
    code: `enum Command {
  Quit,
  Echo(String),
  Move { x: i32, y: i32 },
}

fn handle(cmd: Command) {
  match cmd {
    Command::Quit => println!("Quitting"),
    Command::Echo(msg) => println!("{}", msg),
    Command::Move { x, y } => println!("Move to ({}, {})", x, y),
  }
}`,
    difficulty: 'easy',
    tags: ['enums', 'pattern-matching'],
  },
  {
    id: 'rust-006',
    language: 'rust',
    title: 'Option Handling',
    description: 'Working with Option type',
    code: `fn find_user(id: u32) -> Option<String> {
  match id {
    1 => Some("Alice".to_string()),
    2 => Some("Bob".to_string()),
    _ => None,
  }
}

let name = find_user(1).unwrap_or("Unknown".to_string());`,
    difficulty: 'easy',
    tags: ['option', 'error-handling'],
  },
  {
    id: 'rust-007',
    language: 'rust',
    title: 'Trait Implementation',
    description: 'Defining and implementing a trait',
    code: `trait Summary {
  fn summarize(&self) -> String;
  fn preview(&self) -> String {
    format!("{}...", &self.summarize()[..20])
  }
}

struct Article {
  title: String,
  content: String,
}

impl Summary for Article {
  fn summarize(&self) -> String {
    format!("{}: {}", self.title, self.content)
  }
}`,
    difficulty: 'medium',
    tags: ['traits', 'polymorphism'],
  },
  {
    id: 'rust-008',
    language: 'rust',
    title: 'Generic Function',
    description: 'Generic function with trait bounds',
    code: `fn largest<T: PartialOrd>(list: &[T]) -> &T {
  let mut largest = &list[0];
  for item in &list[1..] {
    if item > largest {
      largest = item;
    }
  }
  largest
}

fn print_all<T: std::fmt::Display>(items: &[T]) {
  for item in items {
    println!("{}", item);
  }
}`,
    difficulty: 'medium',
    tags: ['generics', 'trait-bounds'],
  },
  {
    id: 'rust-009',
    language: 'rust',
    title: 'Error Handling with Result',
    description: 'Custom error type with the ? operator',
    code: `#[derive(Debug)]
enum AppError {
  NotFound(String),
  ParseError(std::num::ParseIntError),
}

impl From<std::num::ParseIntError> for AppError {
  fn from(e: std::num::ParseIntError) -> Self {
    AppError::ParseError(e)
  }
}

fn parse_and_double(s: &str) -> Result<i32, AppError> {
  let n: i32 = s.parse()?;
  Ok(n * 2)
}`,
    difficulty: 'medium',
    tags: ['error-handling', 'result'],
  },
  {
    id: 'rust-010',
    language: 'rust',
    title: 'Iterator Chains',
    description: 'Functional iterator transformations',
    code: `let words = vec!["hello", "world", "foo", "bar"];
let result: Vec<String> = words
  .iter()
  .filter(|w| w.len() > 3)
  .map(|w| w.to_uppercase())
  .collect();

let sum: i32 = (1..=100)
  .filter(|n| n % 2 == 0)
  .sum();`,
    difficulty: 'medium',
    tags: ['iterators', 'functional'],
  },
  {
    id: 'rust-011',
    language: 'rust',
    title: 'Lifetime Annotations',
    description: 'Explicit lifetime annotations on functions',
    code: `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
  if x.len() > y.len() { x } else { y }
}

struct Important<'a> {
  content: &'a str,
}

impl<'a> Important<'a> {
  fn level(&self) -> usize {
    self.content.len()
  }
}`,
    difficulty: 'medium',
    tags: ['lifetimes', 'borrowing'],
  },
  {
    id: 'rust-012',
    language: 'rust',
    title: 'Closure Usage',
    description: 'Closures as function arguments and in collections',
    code: `fn apply<F: Fn(i32) -> i32>(f: F, value: i32) -> i32 {
  f(value)
}

let double = |x| x * 2;
let add_five = |x| x + 5;

let operations: Vec<Box<dyn Fn(i32) -> i32>> = vec![
  Box::new(double),
  Box::new(add_five),
];

let result: i32 = operations.iter().fold(10, |acc, f| f(acc));`,
    difficulty: 'medium',
    tags: ['closures', 'functional'],
  },
  {
    id: 'rust-013',
    language: 'rust',
    title: 'Async/Await',
    description: 'Async function with tokio runtime',
    code: `async fn fetch_data(url: &str) -> Result<String, reqwest::Error> {
  let response = reqwest::get(url).await?;
  let body = response.text().await?;
  Ok(body)
}

async fn fetch_all(urls: Vec<&str>) -> Vec<Result<String, reqwest::Error>> {
  let futures: Vec<_> = urls.into_iter().map(|url| fetch_data(url)).collect();
  futures::future::join_all(futures).await
}

#[tokio::main]
async fn main() {
  let data = fetch_data("https://example.com").await;
  println!("{:?}", data);
}`,
    difficulty: 'hard',
    tags: ['async', 'tokio'],
  },
  {
    id: 'rust-014',
    language: 'rust',
    title: 'Smart Pointers (Rc/Arc)',
    description: 'Reference counting with Rc and Arc',
    code: `use std::sync::{Arc, Mutex};
use std::thread;

fn shared_counter() {
  let counter = Arc::new(Mutex::new(0));
  let mut handles = vec![];

  for _ in 0..10 {
    let counter = Arc::clone(&counter);
    let handle = thread::spawn(move || {
      let mut num = counter.lock().unwrap();
      *num += 1;
    });
    handles.push(handle);
  }

  for handle in handles {
    handle.join().unwrap();
  }
  println!("Result: {}", *counter.lock().unwrap());
}`,
    difficulty: 'hard',
    tags: ['smart-pointers', 'concurrency'],
  },
  {
    id: 'rust-015',
    language: 'rust',
    title: 'Trait Objects',
    description: 'Dynamic dispatch with trait objects',
    code: `trait Draw {
  fn draw(&self);
  fn bounds(&self) -> (f64, f64);
}

struct Screen {
  components: Vec<Box<dyn Draw>>,
}

impl Screen {
  fn run(&self) {
    for component in &self.components {
      component.draw();
    }
  }

  fn add(&mut self, component: Box<dyn Draw>) {
    self.components.push(component);
  }

  fn total_area(&self) -> f64 {
    self.components.iter()
      .map(|c| { let (w, h) = c.bounds(); w * h })
      .sum()
  }
}`,
    difficulty: 'hard',
    tags: ['trait-objects', 'dynamic-dispatch'],
  },
  {
    id: 'rust-016',
    language: 'rust',
    title: 'Macro Rules',
    description: 'Declarative macro for creating a HashMap',
    code: `macro_rules! hashmap {
  ($($key:expr => $value:expr),* $(,)?) => {{
    let mut map = std::collections::HashMap::new();
    $(
      map.insert($key, $value);
    )*
    map
  }};
}

let scores = hashmap! {
  "Alice" => 95,
  "Bob" => 87,
  "Charlie" => 92,
};`,
    difficulty: 'hard',
    tags: ['macros', 'metaprogramming'],
  },
  {
    id: 'rust-017',
    language: 'rust',
    title: 'Concurrent Channels',
    description: 'Multi-producer single-consumer channel',
    code: `use std::sync::mpsc;
use std::thread;

fn pipeline() {
  let (tx, rx) = mpsc::channel();

  for i in 0..5 {
    let tx = tx.clone();
    thread::spawn(move || {
      let msg = format!("message {} from thread {}", i, i);
      tx.send(msg).unwrap();
    });
  }
  drop(tx);

  for received in rx {
    println!("Got: {}", received);
  }
}`,
    difficulty: 'hard',
    tags: ['channels', 'concurrency'],
  },
  {
    id: 'rust-018',
    language: 'rust',
    title: 'Custom Iterator',
    description: 'Implementing Iterator trait for a custom type',
    code: `struct Fibonacci {
  a: u64,
  b: u64,
}

impl Fibonacci {
  fn new() -> Self {
    Fibonacci { a: 0, b: 1 }
  }
}

impl Iterator for Fibonacci {
  type Item = u64;

  fn next(&mut self) -> Option<Self::Item> {
    let result = self.a;
    let next = self.a + self.b;
    self.a = self.b;
    self.b = next;
    Some(result)
  }
}

let fibs: Vec<u64> = Fibonacci::new().take(10).collect();`,
    difficulty: 'hard',
    tags: ['iterator', 'trait'],
  },
];

export default snippets;
