// @codetype medium | Counter protected by a mutex
package main

import (
	"fmt"
	"sync"
)

type SafeCounter struct {
	mu     sync.Mutex
	counts map[string]int
}

func (c *SafeCounter) Inc(key string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.counts[key]++
}

func main() {
	c := SafeCounter{counts: make(map[string]int)}
	var wg sync.WaitGroup
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			c.Inc("visits")
		}()
	}
	wg.Wait()
	fmt.Println(c.counts["visits"])
}
