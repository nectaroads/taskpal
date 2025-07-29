const { databaseQuery } = require('../postgre');
const { isLengthGreaterThan } = require('../utils/extras');
const { print } = require('../utils/io');

function validateUsername(string, res = null) {
  if (!isLengthGreaterThan(string, 4)) {
    if (res) res.status(401).json({ key: 'register', value: { type: 'invalidUsernameLength' } });
    return print(`[Warn] Validation failed: ${string} length is lesser than 5 characters`);
  }
  return string;
}

function validatePassword(string, res = null) {
  if (!isLengthGreaterThan(string, 7)) {
    if (res) res.status(401).json({ key: 'register', value: { type: 'invalidPasswordLength' } });
    return print(`[Warn] Validation failed: ${string} length is lesser than 8 characters`);
  }
  return string;
}

async function databaseGetUsers() {
  const res = await databaseQuery('SELECT * FROM users');
  return res.rows;
}

async function databaseGetUserByUsername(username) {
  const result = await databaseQuery(`SELECT * FROM users WHERE username = $1 LIMIT 1;`, [username]);
  if (result.rows.length === 0) return print(`[Database] Search failed: ${username} doesn't exist`);
  return result.rows[0];
}

async function databaseCreateUser(table, res = null) {
  let username = validateUsername(table.username, res);
  if (!username) return;
  let password = validatePassword(table.password, res);
  if (!password) return;
  const result = await databaseQuery(`INSERT INTO users (username, password) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING;`, [username, password]);
  const rowCount = result.rowCount > 0;
  if (!rowCount) {
    if (res) res.status(401).json({ key: 'register', value: { type: 'invalid' } });
    return print(`[Database] Database failed: ${username} was not created`);
  }
  print(`[Database] Database successful: ${username} was created`);
  return rowCount;
}

async function databaseChangeUsername(table, res = null) {
  const username = validateUsername(table.username, res);
  if (!username) return;
  const result = await databaseQuery(`UPDATE users SET username = $1 WHERE username = $2`, [table.username, table.oldUsername]);
  if (result.rowCount === 0) {
    if (res) res.status(401).json({ key: 'change', value: { type: 'invalidUsername' } });
    return print(`[Database] Change failed: ${table.oldUsername} not updated`);
  }
  print(`[Database] Change successful: ${table.oldUsername} → ${username}`);
  return true;
}

async function databaseChangePassword(table, res = null) {
  const password = validatePassword(table.password, res);
  if (!password) return;
  const result = await databaseQuery(`UPDATE users SET password = $1 WHERE username = $2`, [table.password, table.username]);
  if (result.rowCount === 0) {
    if (res) res.status(401).json({ key: 'change', value: { type: 'invalidPassword' } });
    return print(`[Database] Change failed: password for ${table.username} not updated`);
  }
  print(`[Database] Change successful: password updated for ${table.username}`);
  return true;
}

module.exports = { databaseGetUsers, databaseGetUserByUsername, databaseCreateUser, databaseChangeUsername, databaseChangePassword };
