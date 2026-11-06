// @codetype medium | Generic stack wrapping a Vec
#[derive(Debug, Default)]
struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self {
        Self { items: Vec::new() }
    }

    fn push(&mut self, item: T) {
        self.items.push(item);
    }

    fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }

    fn peek(&self) -> Option<&T> {
        self.items.last()
    }

    fn len(&self) -> usize {
        self.items.len()
    }
}

fn main() {
    let mut s = Stack::new();
    s.push(1);
    s.push(2);
    println!("{:?} {:?} {}", s.pop(), s.peek(), s.len());
}
