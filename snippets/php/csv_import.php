<?php
// @codetype medium | Read a CSV file into associative arrays

function readCsv(string $path): array
{
    $handle = fopen($path, 'r');
    if ($handle === false) {
        throw new RuntimeException("Cannot open {$path}");
    }

    $header = fgetcsv($handle, escape: '\\');
    $rows = [];
    while (($row = fgetcsv($handle, escape: '\\')) !== false) {
        $rows[] = array_combine($header, $row);
    }
    fclose($handle);

    return $rows;
}
