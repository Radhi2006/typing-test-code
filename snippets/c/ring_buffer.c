// @codetype medium | Circular queue for bytes
#include <stdbool.h>
#include <stdint.h>

#define CAPACITY 64

typedef struct {
    uint8_t data[CAPACITY];
    int head, tail, size;
} RingBuffer;

bool rb_put(RingBuffer *rb, uint8_t byte) {
    if (rb->size == CAPACITY) return false;
    rb->data[rb->tail] = byte;
    rb->tail = (rb->tail + 1) % CAPACITY;
    rb->size++;
    return true;
}

bool rb_get(RingBuffer *rb, uint8_t *out) {
    if (rb->size == 0) return false;
    *out = rb->data[rb->head];
    rb->head = (rb->head + 1) % CAPACITY;
    rb->size--;
    return true;
}
