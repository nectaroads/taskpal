const { databaseGetProjectsByUsername } = require('../database/projects');
const { getInstance } = require('../scripts/authentication');
const { print } = require('../utils/io');

module.exports = async (body, res) => {
  const instance = getInstance(body.value.token);
  const token = await databaseGetProjectsByUsername(instance.username);
  if (!token) return print(`[Warn] Process failed: Failed to find project`);
  print(`[Log] Process successful: Found projects`);
  return res.status(200).json({ key: 'projectList', value: { type: 'success', projects: token } });
};
