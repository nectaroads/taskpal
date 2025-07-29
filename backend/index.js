const { startExpress } = require('./source/express');
const { print } = require('./source/utils/io');

async function main() {
  console.clear();
  print('[Setup] Starting application: Hello world!');
  startExpress();
}

main();
