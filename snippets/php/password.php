<?php
// @codetype easy | Hash and verify passwords the safe way

$password = 'correct horse battery staple';
$hash = password_hash($password, PASSWORD_DEFAULT);

if (password_verify($password, $hash)) {
    echo 'Login successful';
    if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
        $hash = password_hash($password, PASSWORD_DEFAULT);
    }
} else {
    echo 'Invalid credentials';
}
