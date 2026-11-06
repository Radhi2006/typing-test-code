// @codetype easy | Pick a subset of keys from an object, fully typed
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const key of keys) {
    out[key] = obj[key];
  }
  return out;
}

const user = { id: 1, name: 'Ada', password: 'secret' };
console.log(pick(user, ['id', 'name']));
