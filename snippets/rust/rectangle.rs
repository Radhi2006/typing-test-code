// @codetype easy | Struct with an impl block and methods
#[derive(Debug, Clone, Copy)]
struct Rectangle {
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

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

fn main() {
    let big = Rectangle::new(8.0, 6.0);
    let small = Rectangle::new(3.0, 2.0);
    println!("{:?} area={} holds={}", big, big.area(), big.can_hold(&small));
}
