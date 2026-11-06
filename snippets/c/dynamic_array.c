// @codetype hard | Growable array that doubles its capacity
#include <stdlib.h>

typedef struct {
    int *items;
    size_t len;
    size_t cap;
} Vec;

int vec_push(Vec *v, int value) {
    if (v->len == v->cap) {
        size_t new_cap = v->cap ? v->cap * 2 : 8;
        int *grown = realloc(v->items, new_cap * sizeof(int));
        if (grown == NULL) return -1;
        v->items = grown;
        v->cap = new_cap;
    }
    v->items[v->len++] = value;
    return 0;
}

void vec_free(Vec *v) {
    free(v->items);
    v->items = NULL;
    v->len = v->cap = 0;
}
