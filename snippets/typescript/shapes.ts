// @codetype easy | Discriminated union with exhaustive switch
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number };

export function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rect':
      return shape.width * shape.height;
    case 'triangle':
      return (shape.base * shape.height) / 2;
    default: {
      const unreachable: never = shape;
      throw new Error(`Unknown shape: ${JSON.stringify(unreachable)}`);
    }
  }
}
