// @codetype easy | Validate an email address and normalize it
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(input: string): string | null {
  const email = input.trim().toLowerCase();
  return EMAIL_PATTERN.test(email) ? email : null;
}

console.log(normalizeEmail('  Ada@Example.COM ')); // ada@example.com
console.log(normalizeEmail('not-an-email')); // null
