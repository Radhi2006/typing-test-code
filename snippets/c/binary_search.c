// @codetype easy | Binary search on a sorted array of ints
#include <stddef.h>

int binary_search(const int *items, size_t len, int target) {
    size_t low = 0, high = len;
    while (low < high) {
        size_t mid = low + (high - low) / 2;
        if (items[mid] == target) return (int)mid;
        if (items[mid] < target) low = mid + 1;
        else high = mid;
    }
    return -1;
}
