<?php
// @codetype easy | FizzBuzz with a match expression

for ($i = 1; $i <= 20; $i++) {
    echo match (true) {
        $i % 15 === 0 => 'FizzBuzz',
        $i % 3 === 0 => 'Fizz',
        $i % 5 === 0 => 'Buzz',
        default => $i,
    }, PHP_EOL;
}
