<?php
// @codetype easy | Filter, map and sum with array functions

$orders = [
    ['id' => 1, 'total' => 150000, 'paid' => true],
    ['id' => 2, 'total' => 82000, 'paid' => false],
    ['id' => 3, 'total' => 230000, 'paid' => true],
];

$paid = array_filter($orders, fn ($o) => $o['paid']);
$totals = array_map(fn ($o) => $o['total'], $paid);

echo 'Revenue: ' . number_format(array_sum($totals), 0, ',', '.');
