const crypto = require('crypto');

function hashSHA256(text) {
  return crypto
    .createHash('sha256')
    .update(text + 'salt')
    .digest('hex');
}

function generateToken(string) {
  const base = `${Date.now()}-${crypto.randomUUID()}-${string}`;
  const hash = crypto.createHash('sha256').update(base).digest('hex');
  return hash;
}

module.exports = { hashSHA256, generateToken };
