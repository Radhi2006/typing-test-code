// @codetype hard | LRU cache with container/list and a map
package cache

import "container/list"

type entry struct {
	key   string
	value int
}

type LRU struct {
	capacity int
	order    *list.List
	items    map[string]*list.Element
}

func NewLRU(capacity int) *LRU {
	return &LRU{capacity, list.New(), make(map[string]*list.Element)}
}

func (c *LRU) Get(key string) (int, bool) {
	if el, ok := c.items[key]; ok {
		c.order.MoveToFront(el)
		return el.Value.(*entry).value, true
	}
	return 0, false
}

func (c *LRU) Put(key string, value int) {
	if el, ok := c.items[key]; ok {
		el.Value.(*entry).value = value
		c.order.MoveToFront(el)
		return
	}
	c.items[key] = c.order.PushFront(&entry{key, value})
	if c.order.Len() > c.capacity {
		oldest := c.order.Back()
		c.order.Remove(oldest)
		delete(c.items, oldest.Value.(*entry).key)
	}
}
