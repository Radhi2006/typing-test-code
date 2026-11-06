// @codetype medium | Result type for errors without exceptions
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export function parseAge(input: string): Result<number, string> {
  const age = Number(input);
  if (!Number.isInteger(age)) return err('Age must be a whole number');
  if (age < 0 || age > 150) return err('Age is out of range');
  return ok(age);
}

const result = parseAge('42');
if (result.ok) console.log(result.value + 1);
else console.error(result.error);
