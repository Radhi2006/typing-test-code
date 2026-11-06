// @codetype easy | Trial division primality test
#include <stdbool.h>
#include <stdio.h>

bool is_prime(unsigned n) {
    if (n < 2) return false;
    if (n % 2 == 0) return n == 2;
    for (unsigned i = 3; i * i <= n; i += 2) {
        if (n % i == 0) return false;
    }
    return true;
}

int main(void) {
    for (unsigned n = 1; n <= 30; n++) {
        if (is_prime(n)) printf("%u ", n);
    }
    putchar('\n');
    return 0;
}
