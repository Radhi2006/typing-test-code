<?php
// @codetype easy | Memoized Fibonacci with a static cache

function fib(int $n): int
{
    static $cache = [0 => 0, 1 => 1];
    if (!isset($cache[$n])) {
        $cache[$n] = fib($n - 1) + fib($n - 2);
    }
    return $cache[$n];
}

echo implode(', ', array_map('fib', range(0, 15)));
