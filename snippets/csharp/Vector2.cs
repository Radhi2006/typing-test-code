// @codetype medium | Struct with operator overloading
using System;

public readonly struct Vector2
{
    public double X { get; }
    public double Y { get; }

    public Vector2(double x, double y) => (X, Y) = (x, y);

    public double Length => Math.Sqrt(X * X + Y * Y);

    public static Vector2 operator +(Vector2 a, Vector2 b) => new(a.X + b.X, a.Y + b.Y);
    public static Vector2 operator -(Vector2 a, Vector2 b) => new(a.X - b.X, a.Y - b.Y);
    public static Vector2 operator *(Vector2 v, double s) => new(v.X * s, v.Y * s);

    public override string ToString() => $"({X:0.##}, {Y:0.##})";
}
