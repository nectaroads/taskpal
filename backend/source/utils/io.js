const fs = require('fs');
const path = require('path');

const tags = { '[Request]': '\x1b[34m', '[Log]': '\x1b[90m', '[Success]': '\x1b[32m', '[Error]': '\x1b[31m', '[Warn]': '\x1b[33m', '[Database]': '\x1b[36m', '[Setup]': '\x1b[35m' };
const blocks = { '[Request]': '\x1b[44m', '[Log]': '\x1b[100m', '[Success]': '\x1b[42m', '[Error]': '\x1b[41m', '[Warn]': '\x1b[43m', '[Database]': '\x1b[46m', '[Setup]': '\x1b[45m' };
const specials = { value: '\x1b[2m', reset: '\x1b[0m', gray: '\x1b[90m' };

function getTodayFilename() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}${month}${year}.txt`;
}

function getCallerPath(depth = 3) {
  const stack = new Error().stack;
  const line = stack.split('\n')[depth];
  const match = line.match(/at\s+(.*?)\s+\((.*):\d+:\d+\)/) || line.match(/at\s+(.*):\d+:\d+/);
  let fn = '';
  let rawPath = null;
  if (match) {
    if (match.length === 3) {
      fn = match[1];
      rawPath = match[2];
    } else if (match.length === 2) {
      rawPath = match[1];
    }
  }
  if (!rawPath) return { file: '', fn };
  const rel = path.relative(process.cwd(), rawPath).replace(/\\/g, '/');
  return { file: rel, fn };
}

function log(string) {
  const logDir = path.join(__dirname, '..', 'logs');
  const filename = path.join(logDir, getTodayFilename());
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  fs.appendFile(filename, string + '\n', err => {});
}

function logContent(fileName, table) {
  const logDir = path.join(__dirname, '..', 'logs');
  const filePath = path.join(logDir, fileName.endsWith('.json') ? fileName : `${fileName}.json`);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  fs.writeFile(filePath, JSON.stringify(table, null, 2), err => {});
}

function print(string, value = false) {
  let formattedString = '';
  const { file, fn } = getCallerPath();
  for (const word of string.split(' ')) {
    if (tags[`${word}`]) formattedString += `${blocks[word]}  ${specials.reset} ${tags[word]}${word}${specials.reset} `;
    else if (word.endsWith(':')) formattedString += `${word}${specials.value} `;
    else formattedString += `${word} `;
  }
  console.log(formattedString + `${specials.gray}${file}/${fn}`);
  log(string);
  return value;
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = { print, capitalizeFirstLetter, log, logContent };
