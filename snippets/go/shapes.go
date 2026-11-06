// @codetype medium | Interfaces implemented by struct methods
package main

import (
	"fmt"
	"math"
)

type Shape interface {
	Area() float64
	Perimeter() float64
}

type Rect struct{ W, H float64 }
type Circle struct{ R float64 }

func (r Rect) Area() float64      { return r.W * r.H }
func (r Rect) Perimeter() float64 { return 2 * (r.W + r.H) }

func (c Circle) Area() float64      { return math.Pi * c.R * c.R }
func (c Circle) Perimeter() float64 { return 2 * math.Pi * c.R }

func main() {
	shapes := []Shape{Rect{3, 4}, Circle{1.5}}
	for _, s := range shapes {
		fmt.Printf("%T area=%.2f perimeter=%.2f\n", s, s.Area(), s.Perimeter())
	}
}
