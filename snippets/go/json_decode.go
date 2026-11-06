// @codetype medium | Decode JSON into structs with tags
package main

import (
	"encoding/json"
	"fmt"
	"log"
)

type Repo struct {
	Name  string   `json:"name"`
	Stars int      `json:"stars"`
	Tags  []string `json:"tags,omitempty"`
}

func main() {
	data := []byte(`[{"name":"codetype","stars":42,"tags":["typing"]}]`)
	var repos []Repo
	if err := json.Unmarshal(data, &repos); err != nil {
		log.Fatal(err)
	}
	for _, r := range repos {
		fmt.Printf("%s has %d stars %v\n", r.Name, r.Stars, r.Tags)
	}
}
