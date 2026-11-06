// @codetype easy | Fibonacci generator built from a closure
package main

import "fmt"

func fibonacci() func() int {
	a, b := 0, 1
	return func() int {
		result := a
		a, b = b, a+b
		return result
	}
}

func main() {
	next := fibonacci()
	for i := 0; i < 10; i++ {
		fmt.Print(next(), " ")
	}
	fmt.Println()
}
