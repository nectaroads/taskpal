const tags = { '[Request]': '\x1b[34m', '[Log]': '\x1b[90m', '[Success]': '\x1b[32m', '[Error]': '\x1b[31m', '[Warn]': '\x1b[33m', '[Database]': '\x1b[36m', '[Setup]': '\x1b[35m' };
const blocks = { '[Request]': '\x1b[44m', '[Log]': '\x1b[100m', '[Success]': '\x1b[42m', '[Error]': '\x1b[41m', '[Warn]': '\x1b[43m', '[Database]': '\x1b[46m', '[Setup]': '\x1b[45m' };
const specials = { value: '\x1b[2m', reset: '\x1b[0m', gray: '\x1b[90m' };

export function print(string, value = false) {
  let formattedString = '';
  for (const word of string.split(' ')) {
    if (tags[`${word}`]) formattedString += `${blocks[word]}  ${specials.reset} ${tags[word]}${word}${specials.reset} `;
    else if (word.endsWith(':')) formattedString += `${word}${specials.value} `;
    else formattedString += `${word} `;
  }
  console.log(formattedString);
  return value;
}
