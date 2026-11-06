// @codetype easy | Binary search as a static helper method
public static class Search
{
    public static int BinarySearch(int[] items, int target)
    {
        int low = 0, high = items.Length - 1;
        while (low <= high)
        {
            int mid = low + (high - low) / 2;
            if (items[mid] == target) return mid;
            if (items[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}
