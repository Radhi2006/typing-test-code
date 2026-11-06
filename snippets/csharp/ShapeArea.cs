// @codetype medium | Switch expressions with type and property patterns
using System;

public abstract record Shape;
public record Circle(double Radius) : Shape;
public record Rect(double Width, double Height) : Shape;

public static class ShapeArea
{
    public static double Area(Shape shape) => shape switch
    {
        Circle { Radius: <= 0 } => 0,
        Circle c => Math.PI * c.Radius * c.Radius,
        Rect { Width: var w, Height: var h } when w == h => w * w,
        Rect r => r.Width * r.Height,
        _ => throw new ArgumentException("Unknown shape", nameof(shape)),
    };
}
