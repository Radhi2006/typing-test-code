// @codetype medium | Parse a query string into an object with arrays
export function parseQuery(search) {
  const params = new URLSearchParams(search);
  const result = {};

  for (const [key, value] of params) {
    if (key in result) {
      result[key] = [].concat(result[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

console.log(parseQuery('?tag=js&tag=css&page=2'));
// { tag: ['js', 'css'], page: '2' }
