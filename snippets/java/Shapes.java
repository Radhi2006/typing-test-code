// @codetype medium | Sealed interface with pattern matching switch
public class Shapes {
    sealed interface Shape permits Circle, Square, Rectangle {}
    record Circle(double radius) implements Shape {}
    record Square(double side) implements Shape {}
    record Rectangle(double width, double height) implements Shape {}

    static double area(Shape shape) {
        return switch (shape) {
            case Circle c -> Math.PI * c.radius() * c.radius();
            case Square s -> s.side() * s.side();
            case Rectangle r -> r.width() * r.height();
        };
    }

    public static void main(String[] args) {
        System.out.println(area(new Rectangle(3, 4)));
    }
}
