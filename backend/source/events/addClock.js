const { databaseAddClock } = require('../database/projects');
const { getInstance } = require('../scripts/authentication');
const { print } = require('../utils/io');

module.exports = async (body, res) => {
  const instance = getInstance(body.value.token);
  const token = await databaseAddClock({ ...body.value, username: instance.username }, res);
  if (!token) return print(`[Warn] Process failed: Failed to add clock`);
  print(`[Log] Process successful: New clock`);
  return res.status(200).json({ key: 'addClock', value: { type: 'success', token: token } });
};
