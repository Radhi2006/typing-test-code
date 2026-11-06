<?php
// @codetype hard | Paginate an array and build page metadata

function paginate(array $items, int $page, int $perPage = 10): array
{
    $total = count($items);
    $pages = max(1, (int) ceil($total / $perPage));
    $page = min(max(1, $page), $pages);
    $offset = ($page - 1) * $perPage;

    return [
        'data' => array_slice($items, $offset, $perPage),
        'meta' => [
            'page' => $page,
            'per_page' => $perPage,
            'total' => $total,
            'pages' => $pages,
            'has_prev' => $page > 1,
            'has_next' => $page < $pages,
        ],
    ];
}

$result = paginate(range(1, 95), page: 3);
print_r($result['meta']);
