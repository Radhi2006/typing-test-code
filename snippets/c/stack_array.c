// @codetype medium | Fixed-size integer stack with bounds checks
#include <stdbool.h>

#define STACK_MAX 128

typedef struct {
    int data[STACK_MAX];
    int top;
} Stack;

void stack_init(Stack *s) { s->top = -1; }

bool stack_push(Stack *s, int value) {
    if (s->top >= STACK_MAX - 1) return false;
    s->data[++s->top] = value;
    return true;
}

bool stack_pop(Stack *s, int *out) {
    if (s->top < 0) return false;
    *out = s->data[s->top--];
    return true;
}
