<?php
// @codetype medium | Safe database query with PDO prepared statements

function findUserByEmail(PDO $pdo, string $email): ?array
{
    $stmt = $pdo->prepare(
        'SELECT id, name, email FROM users WHERE email = :email LIMIT 1'
    );
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    return $user ?: null;
}

$pdo = new PDO('sqlite:app.db', options: [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);
$user = findUserByEmail($pdo, 'ada@example.com');
echo $user ? "Hello {$user['name']}" : 'User not found';
