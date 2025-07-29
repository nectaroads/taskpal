const { authDisconnectUser } = require('../scripts/authentication');
const { print } = require('../utils/io');

module.exports = async (body, res) => {
  const token = await authDisconnectUser(body.value, res);
  if (!token) return print(`[Warn] Process failed: Account failed to logout`);
  print(`[Log] Process successful: Account succeeded to logout`);
  return res.status(200).json({ key: 'logout', value: { type: 'success' } });
};
