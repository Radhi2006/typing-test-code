/** Small color helpers shared by the scene and the syntax highlighter. */

export type RGB = [number, number, number];

export function parseHex(hex: string): RGB {
  let h = hex.replace('#', '');
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function toHex([r, g, b]: RGB): string {
  const part = (v: number) => Math.round(v).toString(16).padStart(2, '0');
  return `#${part(r)}${part(g)}${part(b)}`;
}

/** `t` = 0 gives `a`, `t` = 1 gives `b`. */
export function mix(a: string, b: string, t: number): string {
  const x = parseHex(a);
  const y = parseHex(b);
  return toHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]);
}

/** true for black, white and greys, which make flat, lifeless leaves */
export function isGrey(hex: string): boolean {
  const c = parseHex(hex);
  return Math.max(...c) - Math.min(...c) < 48;
}

function luminance([r, g, b]: RGB): number {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrast(a: string, b: string): number {
  const x = luminance(parseHex(a));
  const y = luminance(parseHex(b));
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/**
 * Pulls `color` toward `toward` just far enough to read at `target` contrast on
 * `bg`, measured after the color is faded to `opacity` (how untyped code is drawn).
 */
export function liftContrast(
  color: string,
  bg: string,
  toward: string,
  target: number,
  opacity = 1,
): string {
  const seen = (c: string) => contrast(mix(bg, c, opacity), bg);
  if (seen(color) >= target) return color;
  for (let t = 0.08; t < 1; t += 0.08) {
    const c = mix(color, toward, t);
    if (seen(c) >= target) return c;
  }
  return toward;
}
