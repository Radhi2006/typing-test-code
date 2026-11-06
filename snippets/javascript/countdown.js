// @codetype easy | Format the time left until a date
export function timeUntil(date) {
  const diff = Math.max(0, date.getTime() - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff / 3_600_000) % 24);
  const minutes = Math.floor((diff / 60_000) % 60);
  return `${days}d ${hours}h ${minutes}m`;
}

console.log(timeUntil(new Date('2030-01-01')));
