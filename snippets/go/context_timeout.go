// @codetype medium | Cancel slow work with context.WithTimeout
package main

import (
	"context"
	"fmt"
	"time"
)

func slowQuery(ctx context.Context) (string, error) {
	select {
	case <-time.After(2 * time.Second):
		return "rows", nil
	case <-ctx.Done():
		return "", ctx.Err()
	}
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	result, err := slowQuery(ctx)
	if err != nil {
		fmt.Println("query failed:", err)
		return
	}
	fmt.Println(result)
}
