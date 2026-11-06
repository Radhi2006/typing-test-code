// @codetype hard | Merge several channels into one with select
package main

import (
	"fmt"
	"time"
)

func producer(name string, delay time.Duration) <-chan string {
	out := make(chan string)
	go func() {
		defer close(out)
		for i := 1; i <= 3; i++ {
			time.Sleep(delay)
			out <- fmt.Sprintf("%s #%d", name, i)
		}
	}()
	return out
}

func main() {
	a := producer("fast", 50*time.Millisecond)
	b := producer("slow", 120*time.Millisecond)
	for a != nil || b != nil {
		select {
		case msg, ok := <-a:
			if !ok {
				a = nil
				continue
			}
			fmt.Println(msg)
		case msg, ok := <-b:
			if !ok {
				b = nil
				continue
			}
			fmt.Println(msg)
		}
	}
}
