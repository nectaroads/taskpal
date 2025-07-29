const { databaseJoinProject } = require('../database/projects');
const { print } = require('../utils/io');

module.exports = async (body, res) => {
  const token = await databaseJoinProject(body.value);
  if (!token) return print(`[Warn] Process failed: Failed to join project`);
  print(`[Log] Process successful: Joined projects`);
  return res.status(200).json({ key: 'join', value: { type: 'success', projects: token } });
};
