// @codetype medium | Read a file line by line with bufio.Scanner
package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

func main() {
	file, err := os.Open("todo.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for n := 1; scanner.Scan(); n++ {
		line := strings.TrimSpace(scanner.Text())
		if line != "" {
			fmt.Printf("%3d | %s\n", n, line)
		}
	}
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
}
