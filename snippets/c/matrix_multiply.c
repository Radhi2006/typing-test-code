// @codetype medium | Multiply two fixed-size matrices
#include <stdio.h>

#define N 3

void multiply(int a[N][N], int b[N][N], int out[N][N]) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            out[i][j] = 0;
            for (int k = 0; k < N; k++) {
                out[i][j] += a[i][k] * b[k][j];
            }
        }
    }
}

void print_matrix(int m[N][N]) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) printf("%4d", m[i][j]);
        putchar('\n');
    }
}
