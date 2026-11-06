// @codetype easy | The djb2 string hash function
#include <stdio.h>

unsigned long hash(const char *str) {
    unsigned long h = 5381;
    int c;
    while ((c = *str++) != 0) {
        h = ((h << 5) + h) + (unsigned long)c; /* h * 33 + c */
    }
    return h;
}

int main(void) {
    printf("%lu\n", hash("codetype"));
    return 0;
}
