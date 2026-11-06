// @codetype easy | Greatest common divisor and least common multiple
#include <stdio.h>

long gcd(long a, long b) {
    while (b != 0) {
        long r = a % b;
        a = b;
        b = r;
    }
    return a;
}

long lcm(long a, long b) { return a / gcd(a, b) * b; }

int main(void) {
    printf("gcd=%ld lcm=%ld\n", gcd(84, 36), lcm(4, 6));
    return 0;
}
