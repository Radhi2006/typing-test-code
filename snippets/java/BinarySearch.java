// @codetype easy | Iterative binary search on a sorted int array
public class BinarySearch {
    public static int search(int[] items, int target) {
        int low = 0;
        int high = items.length - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (items[mid] == target) return mid;
            if (items[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}
