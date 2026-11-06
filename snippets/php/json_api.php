<?php
// @codetype medium | Return a JSON API response with status codes

function respond(mixed $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id) {
    respond(['error' => 'Missing or invalid id'], 400);
}

respond(['id' => $id, 'title' => 'Learn to type code', 'done' => false]);
