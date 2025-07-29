const { authLoginUser } = require('../scripts/authentication');
const { print } = require('../utils/io');

module.exports = async (body, res) => {
  const token = await authLoginUser(body.value, res);
  if (!token) return print(`[Warn] Process failed: Account failed to login`);
  print(`[Log] Process successful: Account succeeded to login`);
  return res.status(200).json({ key: 'login', value: { type: 'success', token: token } });
};
