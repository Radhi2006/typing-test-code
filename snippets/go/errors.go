// @codetype medium | Sentinel errors, wrapping and errors.Is
package main

import (
	"errors"
	"fmt"
)

var ErrNotFound = errors.New("not found")

type Store struct{ data map[string]string }

func (s *Store) Get(key string) (string, error) {
	v, ok := s.data[key]
	if !ok {
		return "", fmt.Errorf("get %q: %w", key, ErrNotFound)
	}
	return v, nil
}

func main() {
	s := &Store{data: map[string]string{"lang": "go"}}
	if _, err := s.Get("editor"); errors.Is(err, ErrNotFound) {
		fmt.Println("missing key:", err)
	}
}
