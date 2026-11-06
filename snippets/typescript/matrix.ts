// @codetype medium | Transpose and multiply number matrices
type Matrix = number[][];

export const transpose = (m: Matrix): Matrix =>
  m[0].map((_, col) => m.map((row) => row[col]));

export function multiply(a: Matrix, b: Matrix): Matrix {
  if (a[0].length !== b.length) {
    throw new Error('Columns of A must equal rows of B');
  }
  const bt = transpose(b);
  return a.map((row) =>
    bt.map((col) => row.reduce((sum, value, i) => sum + value * col[i], 0)),
  );
}

console.log(multiply([[1, 2], [3, 4]], [[5, 6], [7, 8]]));
