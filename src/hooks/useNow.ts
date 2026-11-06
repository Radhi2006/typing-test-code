import { useEffect, useState } from 'react';

/** Re-renders every `interval` ms while `active`, returning performance.now(). */
export function useNow(active: boolean, interval = 250): number {
  const [now, setNow] = useState(() => performance.now());
  useEffect(() => {
    if (!active) {
      setNow(performance.now());
      return;
    }
    const id = window.setInterval(() => setNow(performance.now()), interval);
    return () => window.clearInterval(id);
  }, [active, interval]);
  return now;
}
