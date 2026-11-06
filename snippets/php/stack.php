<?php
// @codetype medium | Typed stack class with exceptions

final class Stack
{
    private array $items = [];

    public function push(mixed $item): void
    {
        $this->items[] = $item;
    }

    public function pop(): mixed
    {
        if ($this->isEmpty()) {
            throw new UnderflowException('Stack is empty');
        }
        return array_pop($this->items);
    }

    public function peek(): mixed
    {
        return $this->items[array_key_last($this->items)] ?? null;
    }

    public function isEmpty(): bool
    {
        return $this->items === [];
    }
}
