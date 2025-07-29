const { databaseChangeUsername } = require('../database/users');
const { getInstance, authUpdateUsername } = require('../scripts/authentication');
const { print } = require('../utils/io');

module.exports = async (body, res) => {
  const instance = getInstance(body.value.token);
  const token = await databaseChangeUsername({ ...body.value, oldUsername: instance.username }, res);
  if (!token) return print(`[Warn] Process failed: Failed to change username`);
  print(`[Log] Process successful: New username`);
  authUpdateUsername(body.value, res);
  return res.status(200).json({ key: 'change', value: { type: 'success', token: token } });
};
