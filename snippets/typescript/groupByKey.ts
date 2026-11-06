// @codetype medium | Group items into a record keyed by a property
export function groupByKey<T, K extends PropertyKey>(
  items: readonly T[],
  getKey: (item: T) => K,
): Record<K, T[]> {
  const groups = {} as Record<K, T[]>;
  for (const item of items) {
    const key = getKey(item);
    (groups[key] ??= []).push(item);
  }
  return groups;
}

const orders = [
  { id: 1, status: 'paid' },
  { id: 2, status: 'pending' },
  { id: 3, status: 'paid' },
] as const;

console.log(groupByKey(orders, (o) => o.status));
