// @codetype medium | In-place quicksort with Lomuto partition
public class QuickSort {
    public static void sort(int[] a, int low, int high) {
        if (low >= high) return;
        int p = partition(a, low, high);
        sort(a, low, p - 1);
        sort(a, p + 1, high);
    }

    private static int partition(int[] a, int low, int high) {
        int pivot = a[high];
        int i = low;
        for (int j = low; j < high; j++) {
            if (a[j] < pivot) {
                int tmp = a[i]; a[i] = a[j]; a[j] = tmp;
                i++;
            }
        }
        int tmp = a[i]; a[i] = a[high]; a[high] = tmp;
        return i;
    }
}
