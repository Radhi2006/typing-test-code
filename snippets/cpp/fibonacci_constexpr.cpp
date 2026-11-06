// @codetype easy | Fibonacci computed at compile time
#include <iostream>

constexpr long long fib(int n) {
    long long a = 0, b = 1;
    for (int i = 0; i < n; ++i) {
        long long next = a + b;
        a = b;
        b = next;
    }
    return a;
}

static_assert(fib(10) == 55, "fib(10) should be 55");

int main() { std::cout << fib(60) << '\n'; }
