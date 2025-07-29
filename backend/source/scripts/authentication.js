const { databaseGetUserByUsername, databaseCreateUser } = require('../database/users');
const { isPlainObject } = require('../utils/extras');
const { logContent, print } = require('../utils/io');
const { generateToken } = require('../utils/security');

let instances = {};

function getInstance(token) {
  if (instances[token]) return instances[token];
  return false;
}

async function authLoginUser(table, res = null) {
  if (!isPlainObject(table)) return print(`[Warn] Data mismatch: Parameter is not a table`);
  if (instances[table.username]) {
    if (res) res.status(401).json({ key: 'login', value: { type: 'invalidInstance' } });
    return print(`[Warn] Authentication failed: ${table.username}'s already connected`);
  }
  const user = await databaseGetUserByUsername(table.username);
  if (!user) {
    if (res) res.status(401).json({ key: 'login', value: { type: 'invalidUsername' } });
    return print(`[Warn] Authentication failed: ${table.username} is invalid`);
  }
  if (instances[user.username]) {
    if (res) res.status(401).json({ key: 'login', value: { type: 'invalidInstance' } });
    authDisconnectUser(table);
    return print(`[Warn] Authentication failed: ${table.username}'s already connected`);
  }
  if (user.password != table.password) {
    if (res) res.status(401).json({ key: 'login', value: { type: 'invalidPassword' } });
    return print(`[Warn] Authentication failed: ${table.username} has invalid password`);
  }
  const token = generateToken(table.username);
  instances[token] = { username: user.username, token: token, lastInteraction: Date.now() };
  instances[user.username] = instances[token];
  print(`[Success] Instance created: ${user.username}`);
  logContent('instances', instances);
  return token;
}

async function authRegisterUser(table, res = null) {
  if (!isPlainObject(table)) return print(`[Warn] Data mismatch: Parameter is not a table`);
  const user = await databaseCreateUser(table, res);
  if (!user) return print(`[Warn] Registration failed: ${table.username}`);
  print(`[Success] Registration successful: ${table.username} was registered`);
  const token = await authLoginUser(table, res);
  return token;
}

async function authDisconnectUser(table, res = null) {
  if (!isPlainObject(table)) return print(`[Warn] Data mismatch: Parameter is not a table`);
  if (!table.token || !instances[table.token]) {
    print(`[Warn] Instance invalid: ${table.username}`);
    if (res) {
      res.status(401).json({ key: 'logout', value: { type: 'invalidInstance' } });
      return false;
    }
  }
  delete instances[instances[table.token].username];
  delete instances[table.token];
  print(`[Success] Instance removed: ${table.username}`);
  logContent('instances', instances);
  return true;
}

async function authUpdateUsername(table, res = null) {
  instances[table.token].username = table.username;
  delete instances[table.oldUsername];
  instances[table.username] = instances[table.token];
}

module.exports = { authDisconnectUser, authLoginUser, authRegisterUser, getInstance, authUpdateUsername };
