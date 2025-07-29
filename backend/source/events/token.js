const { getInstance } = require('../scripts/authentication');
const { print } = require('../utils/io');

module.exports = async (body, res) => {
  const token = getInstance(body.value.token);
  if (!token) return res.status(200).json({ key: 'login', value: { type: 'fail', token: token } });
  print(`[Log] Process successful: Account succeeded to login`);
  return res.status(200).json({ key: 'login', value: { type: 'success', token: token } });
};
