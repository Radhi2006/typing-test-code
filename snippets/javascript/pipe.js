// @codetype easy | Compose functions from left to right
export const pipe = (...fns) => (input) =>
  fns.reduce((value, fn) => fn(value), input);

const shout = pipe(
  (s) => s.trim(),
  (s) => s.toUpperCase(),
  (s) => `${s}!`,
);

console.log(shout('  hello  ')); // HELLO!
