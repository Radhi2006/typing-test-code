// @codetype medium | Implement Iterator for a Fibonacci sequence
struct Fibonacci {
    curr: u64,
    next: u64,
}

impl Iterator for Fibonacci {
    type Item = u64;

    fn next(&mut self) -> Option<Self::Item> {
        let value = self.curr;
        self.curr = self.next;
        self.next = value.checked_add(self.next)?;
        Some(value)
    }
}

fn fibonacci() -> Fibonacci {
    Fibonacci { curr: 0, next: 1 }
}

fn main() {
    let first: Vec<u64> = fibonacci().take(12).collect();
    println!("{first:?}");
}
