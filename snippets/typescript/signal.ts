// @codetype medium | Minimal reactive signal with subscribers
type Listener<T> = (value: T, previous: T) => void;

export function signal<T>(initial: T) {
  let value = initial;
  const listeners = new Set<Listener<T>>();

  return {
    get: () => value,
    set(next: T) {
      if (Object.is(next, value)) return;
      const previous = value;
      value = next;
      listeners.forEach((listener) => listener(value, previous));
    },
    subscribe(listener: Listener<T>) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const count = signal(0);
count.subscribe((now, before) => console.log(`${before} -> ${now}`));
count.set(1);
