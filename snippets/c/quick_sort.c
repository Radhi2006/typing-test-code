// @codetype medium | Recursive quicksort using Hoare-style partition
static void swap(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}

void quick_sort(int *a, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = a[(lo + hi) / 2];
    int i = lo, j = hi;
    while (i <= j) {
        while (a[i] < pivot) i++;
        while (a[j] > pivot) j--;
        if (i <= j) swap(&a[i++], &a[j--]);
    }
    quick_sort(a, lo, j);
    quick_sort(a, i, hi);
}
