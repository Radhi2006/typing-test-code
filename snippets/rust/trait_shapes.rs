// @codetype medium | Traits with default methods and dynamic dispatch
trait Shape {
    fn area(&self) -> f64;
    fn name(&self) -> &str;

    fn describe(&self) -> String {
        format!("{} with area {:.2}", self.name(), self.area())
    }
}

struct Circle(f64);
struct Square(f64);

impl Shape for Circle {
    fn area(&self) -> f64 { std::f64::consts::PI * self.0 * self.0 }
    fn name(&self) -> &str { "circle" }
}

impl Shape for Square {
    fn area(&self) -> f64 { self.0 * self.0 }
    fn name(&self) -> &str { "square" }
}

fn main() {
    let shapes: Vec<Box<dyn Shape>> = vec![Box::new(Circle(1.0)), Box::new(Square(2.0))];
    for shape in &shapes {
        println!("{}", shape.describe());
    }
}
