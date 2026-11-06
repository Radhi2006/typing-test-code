// @codetype medium | Explicit lifetimes on functions and structs
struct Excerpt<'a> {
    text: &'a str,
}

impl<'a> Excerpt<'a> {
    fn first_sentence(&self) -> &'a str {
        self.text.split('.').next().unwrap_or(self.text)
    }
}

fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() { a } else { b }
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let excerpt = Excerpt { text: &novel };
    println!("{}", excerpt.first_sentence());
    println!("{}", longest("rust", "borrow checker"));
}
