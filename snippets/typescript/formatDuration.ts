// @codetype easy | Human readable duration from milliseconds
export function formatDuration(ms: number): string {
  const units: [string, number][] = [
    ['h', 3_600_000],
    ['m', 60_000],
    ['s', 1_000],
  ];
  const parts: string[] = [];
  for (const [label, size] of units) {
    const amount = Math.floor(ms / size);
    if (amount > 0) parts.push(`${amount}${label}`);
    ms %= size;
  }
  return parts.join(' ') || '0s';
}
