// @codetype medium | Run a function at most once per interval
export function throttle(fn, interval = 200) {
  let lastCall = 0;
  let pending = null;

  return function throttled(...args) {
    const now = Date.now();
    const remaining = interval - (now - lastCall);

    if (remaining <= 0) {
      lastCall = now;
      fn.apply(this, args);
    } else if (!pending) {
      pending = setTimeout(() => {
        lastCall = Date.now();
        pending = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}
