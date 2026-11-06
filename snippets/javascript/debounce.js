// @codetype easy | Delay a function until calls stop for a while
export function debounce(fn, wait = 300) {
  let timer = null;

  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}
