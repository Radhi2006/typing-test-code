// @codetype easy | Count words in a sentence with a map
package main

import (
	"fmt"
	"strings"
)

func wordCount(text string) map[string]int {
	counts := make(map[string]int)
	for _, word := range strings.Fields(strings.ToLower(text)) {
		counts[word]++
	}
	return counts
}

func main() {
	fmt.Println(wordCount("go is fun and Go is fast"))
}
