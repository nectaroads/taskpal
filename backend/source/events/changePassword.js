const { databaseChangePassword } = require('../database/users');
const { getInstance } = require('../scripts/authentication');
const { print } = require('../utils/io');

module.exports = async (body, res) => {
  const instance = getInstance(body.value.token);
  const token = await databaseChangePassword({ ...body.value, username: instance.username }, res);
  if (!token) return print(`[Warn] Process failed: Failed to change password`);
  print(`[Log] Process successful: New password`);
  return res.status(200).json({ key: 'change', value: { type: 'success', token: token } });
};
