<?php
// @codetype easy | Create URL slugs from article titles

function slugify(string $text): string
{
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    return trim($text, '-');
}

echo slugify('  Belajar PHP: Dasar & Lanjutan  '); // belajar-php-dasar-lanjutan
