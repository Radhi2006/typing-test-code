// @codetype easy | Binary search over a sorted slice
package main

import "fmt"

func binarySearch(items []int, target int) int {
	low, high := 0, len(items)-1
	for low <= high {
		mid := low + (high-low)/2
		switch {
		case items[mid] == target:
			return mid
		case items[mid] < target:
			low = mid + 1
		default:
			high = mid - 1
		}
	}
	return -1
}

func main() {
	fmt.Println(binarySearch([]int{1, 3, 5, 7, 9}, 7))
}
