const { authRegisterUser } = require('../scripts/authentication');
const { print } = require('../utils/io');

module.exports = async (body, res) => {
  const token = await authRegisterUser(body.value, res);
  if (!token) return print(`[Warn] Process failed: Account failed to register`);
  print(`[Log] Process successful: Account succeeded to register`);
  return res.status(200).json({ key: 'register', value: { type: 'success', token: token } });
};
