// @codetype easy | Flatten nested arrays of any depth
export function flattenDeep(items) {
  const result = [];
  for (const item of items) {
    if (Array.isArray(item)) result.push(...flattenDeep(item));
    else result.push(item);
  }
  return result;
}

console.log(flattenDeep([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]
