<?php
// @codetype medium | Validate form input and collect errors

function validateSignup(array $input): array
{
    $errors = [];

    $name = trim($input['name'] ?? '');
    if (strlen($name) < 3) {
        $errors['name'] = 'Name must be at least 3 characters.';
    }

    if (!filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Please enter a valid email address.';
    }

    $age = filter_var($input['age'] ?? null, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 13, 'max_range' => 120],
    ]);
    if ($age === false) {
        $errors['age'] = 'Age must be between 13 and 120.';
    }

    return $errors;
}
