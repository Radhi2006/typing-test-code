<?php
// @codetype medium | Interface with multiple implementations

interface Shape
{
    public function area(): float;
}

final class Circle implements Shape
{
    public function __construct(private float $radius) {}

    public function area(): float
    {
        return M_PI * $this->radius ** 2;
    }
}

final class Rectangle implements Shape
{
    public function __construct(private float $w, private float $h) {}

    public function area(): float
    {
        return $this->w * $this->h;
    }
}

$shapes = [new Circle(2), new Rectangle(3, 4)];
$total = array_sum(array_map(fn (Shape $s) => $s->area(), $shapes));
printf("Total area: %.2f\n", $total);
