# @codetype easy | Find the index of a value in a sorted list
def binary_search(items: list[int], target: int) -> int:
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
