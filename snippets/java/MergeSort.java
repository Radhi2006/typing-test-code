// @codetype hard | Top-down merge sort with a helper buffer
import java.util.Arrays;

public class MergeSort {
    public static void sort(int[] a) {
        int[] buffer = new int[a.length];
        sort(a, buffer, 0, a.length - 1);
    }

    private static void sort(int[] a, int[] buf, int lo, int hi) {
        if (lo >= hi) return;
        int mid = (lo + hi) >>> 1;
        sort(a, buf, lo, mid);
        sort(a, buf, mid + 1, hi);
        System.arraycopy(a, lo, buf, lo, hi - lo + 1);
        int i = lo, j = mid + 1;
        for (int k = lo; k <= hi; k++) {
            if (i > mid) a[k] = buf[j++];
            else if (j > hi) a[k] = buf[i++];
            else if (buf[j] < buf[i]) a[k] = buf[j++];
            else a[k] = buf[i++];
        }
    }

    public static void main(String[] args) {
        int[] data = {5, 2, 9, 1, 7, 3};
        sort(data);
        System.out.println(Arrays.toString(data));
    }
}
