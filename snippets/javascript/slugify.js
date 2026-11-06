// @codetype easy | Turn a title into a URL friendly slug
export function slugify(text) {
  return text
    .toString()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

console.log(slugify('Hello World, Typing Test!')); // hello-world-typing-test
