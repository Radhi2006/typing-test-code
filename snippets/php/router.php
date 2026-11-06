<?php
// @codetype hard | Tiny router with path parameters and closures

final class Router
{
    private array $routes = [];

    public function get(string $path, callable $handler): void
    {
        $pattern = preg_replace('#\{(\w+)\}#', '(?P<$1>[^/]+)', $path);
        $this->routes[] = ['GET', "#^{$pattern}$#", $handler];
    }

    public function dispatch(string $method, string $uri): string
    {
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';
        foreach ($this->routes as [$verb, $regex, $handler]) {
            if ($verb === $method && preg_match($regex, $path, $m)) {
                $params = array_filter($m, 'is_string', ARRAY_FILTER_USE_KEY);
                return $handler(...$params);
            }
        }
        http_response_code(404);
        return 'Not Found';
    }
}

$router = new Router();
$router->get('/users/{id}', fn (string $id) => "User #{$id}");
echo $router->dispatch('GET', '/users/42');
