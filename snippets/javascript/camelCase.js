// @codetype easy | Convert kebab, snake or spaced text to camelCase
export function camelCase(text) {
  return text
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : ''));
}

console.log(camelCase('user_first-name')); // userFirstName
