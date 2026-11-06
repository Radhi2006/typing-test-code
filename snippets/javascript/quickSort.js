// @codetype medium | Sort numbers with the quicksort algorithm
export function quickSort(items) {
  if (items.length <= 1) return items;

  const [pivot, ...rest] = items;
  const left = [];
  const right = [];

  for (const item of rest) {
    if (item < pivot) left.push(item);
    else right.push(item);
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

console.log(quickSort([5, 3, 8, 1, 9, 2])); // [1, 2, 3, 5, 8, 9]
