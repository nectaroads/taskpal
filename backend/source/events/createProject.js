const { databaseCreateProject } = require('../database/projects');
const { print } = require('../utils/io');

module.exports = async (body, res) => {
  const token = await databaseCreateProject(body.value, res);
  if (!token) return print(`[Warn] Process failed: Failed to create project`);
  print(`[Log] Process successful: New project`);
  return res.status(200).json({ key: 'createProject', value: { type: 'success', token: token } });
};
