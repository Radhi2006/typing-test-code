// @codetype hard | Merge sort returning a new sorted slice
package main

import "fmt"

func mergeSort(items []int) []int {
	if len(items) <= 1 {
		return items
	}
	mid := len(items) / 2
	left := mergeSort(items[:mid])
	right := mergeSort(items[mid:])

	merged := make([]int, 0, len(items))
	i, j := 0, 0
	for i < len(left) && j < len(right) {
		if left[i] <= right[j] {
			merged = append(merged, left[i])
			i++
		} else {
			merged = append(merged, right[j])
			j++
		}
	}
	merged = append(merged, left[i:]...)
	return append(merged, right[j:]...)
}

func main() {
	fmt.Println(mergeSort([]int{38, 27, 43, 3, 9, 82, 10}))
}
