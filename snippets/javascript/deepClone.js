// @codetype medium | Recursively copy objects, arrays and dates
export function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value.getTime());
  if (seen.has(value)) return seen.get(value);

  const copy = Array.isArray(value) ? [] : {};
  seen.set(value, copy);

  for (const key of Object.keys(value)) {
    copy[key] = deepClone(value[key], seen);
  }
  return copy;
}
