// @codetype hard | Fixed pool of goroutines processing jobs from a channel
package main

import (
	"fmt"
	"sync"
	"time"
)

func worker(id int, jobs <-chan int, results chan<- string, wg *sync.WaitGroup) {
	defer wg.Done()
	for job := range jobs {
		time.Sleep(50 * time.Millisecond)
		results <- fmt.Sprintf("worker %d finished job %d", id, job)
	}
}

func main() {
	jobs := make(chan int, 10)
	results := make(chan string, 10)
	var wg sync.WaitGroup

	for w := 1; w <= 3; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}
	for j := 1; j <= 9; j++ {
		jobs <- j
	}
	close(jobs)

	go func() {
		wg.Wait()
		close(results)
	}()
	for r := range results {
		fmt.Println(r)
	}
}
