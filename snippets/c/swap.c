// @codetype easy | Swap two values through pointers
#include <stdio.h>

void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main(void) {
    int x = 3, y = 7;
    swap(&x, &y);
    printf("x=%d y=%d\n", x, y);
    return 0;
}
