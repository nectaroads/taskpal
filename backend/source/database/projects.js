const { databaseQuery } = require('../postgre');
const { getInstance } = require('../scripts/authentication');
const { print } = require('../utils/io');
const { databaseGetUserByUsername } = require('./users');

async function databaseGetProjects() {
  const res = await databaseQuery('SELECT * FROM projects');
  return res.rows;
}

async function databaseGetProjectByInvite(invite) {
  const result = await databaseQuery(`SELECT * FROM users WHERE invite = $1 LIMIT 1;`, [invite]);
  if (result.rows.length === 0) return print(`[Database] Search failed: ${invite} doesn't exist`);
  return result.rows[0];
}

async function databaseGetProjectsByUsername(username) {
  const userResult = await databaseQuery(`SELECT id FROM users WHERE username = $1`, [username]);
  if (userResult.rows.length === 0) {
    print(`[Database] User not found: ${username}`);
    return [];
  }
  const userId = userResult.rows[0].id;
  const projectsResult = await databaseQuery(`SELECT p.id, p.name, p.invite, p.start_day, pr.role FROM participants pr JOIN projects p ON pr.project_id = p.id WHERE pr.user_id = $1 ORDER BY p.start_day DESC`, [userId]);
  const projects = projectsResult.rows;
  for (const project of projects) {
    const clocksResult = await databaseQuery(`SELECT id, date, note, attachment FROM clocks WHERE participant_id = (   SELECT id FROM participants   WHERE user_id = $1 AND project_id = $2   LIMIT 1 ) ORDER BY date DESC`, [userId, project.id]);
    project.clocks = clocksResult.rows;
  }
  return projects;
}

async function databaseCreateProject(table, res = null) {
  if (table.name.length < 5 || table.invite.length < 5) return;
  const result = await databaseQuery(`INSERT INTO projects (name, invite) VALUES ($1, $2) ON CONFLICT (invite) DO NOTHING RETURNING id;`, [table.name, table.invite]);
  const rowCount = result.rowCount > 0;
  if (!rowCount) {
    if (res) res.status(401).json({ key: 'createProject', value: { type: 'invalid' } });
    return print(`[Database] Database failed: ${table.name} was not created`);
  }
  print(`[Database] Database successful: ${table.name} was created`);
  const instance = getInstance(table.token);
  const leader = await databaseGetUserByUsername(instance.username);
  if (!leader) return false;
  await databaseQuery(`INSERT INTO participants (project_id, user_id, role) VALUES ($1, $2, 3);`, [result.rows[0].id, leader.id]);
  print(`[Database] Database successful: ${instance.username} set as leader`);
  return rowCount;
}

async function databaseJoinProject(table, res = null) {
  if (table.invite.length < 5) return;
  const instance = getInstance(table.token);
  const user = await databaseGetUserByUsername(instance.username);
  if (!user) {
    if (res) res.status(404).json({ key: 'join', value: { type: 'user_not_found' } });
    return print(`[Database] Join failed: user not found`);
  }
  const project = await databaseQuery(`SELECT id FROM projects WHERE invite = $1 LIMIT 1;`, [table.invite]);
  if (project.rows.length === 0) {
    if (res) res.status(404).json({ key: 'join', value: { type: 'invalid_invite' } });
    return print(`[Database] Join failed: invalid invite`);
  }
  const projectId = project.rows[0].id;
  const result = await databaseQuery(`INSERT INTO participants (user_id, project_id, role) VALUES ($1, $2, 1) ON CONFLICT DO NOTHING;`, [user.id, projectId]);
  print(`[Database] User ${instance.username} joined project ${table.invite}`);
  if (res) res.status(200).json({ key: 'joinProject', value: { type: 'success' } });
  return true;
}

async function databaseAddClock(table, res = null) {
  const user = await databaseGetUserByUsername(table.username);
  if (!user) {
    if (res) res.status(404).json({ key: 'addClock', value: { type: 'user_not_found' } });
    return print(`[Database] Clock failed: user not found`);
  }

  const project = await databaseQuery(`SELECT id FROM projects WHERE invite = $1 LIMIT 1`, [table.invite]);
  if (project.rows.length === 0) {
    if (res) res.status(404).json({ key: 'addClock', value: { type: 'invalid_invite' } });
    return print(`[Database] Clock failed: invalid invite`);
  }

  const projectId = project.rows[0].id;

  const participant = await databaseQuery(
    `
    SELECT id FROM participants WHERE user_id = $1 AND project_id = $2 LIMIT 1
  `,
    [user.id, projectId]
  );

  if (participant.rows.length === 0) {
    if (res) res.status(403).json({ key: 'addClock', value: { type: 'not_a_participant' } });
    return print(`[Database] Clock failed: not a participant`);
  }

  const participantId = participant.rows[0].id;
  const today = new Date().toISOString().split('T')[0];

  const alreadyClocked = await databaseQuery(
    `
    SELECT id FROM clocks WHERE participant_id = $1 AND date = $2
  `,
    [participantId, today]
  );

  if (alreadyClocked.rows.length > 0) {
    if (res) res.status(409).json({ key: 'addClock', value: { type: 'already_clocked' } });
    return print(`[Database] Clock failed: already clocked today`);
  }

  const note = table.note || '';
  const attachment = table.attachment || null;

  await databaseQuery(
    `
    INSERT INTO clocks (participant_id, date, note, attachment)
    VALUES ($1, $2, $3, $4)`,
    [participantId, today, note, attachment]
  );
  print(`[Database] Clocked: ${table.username} on project ${table.invite}`);
  return true;
}

module.exports = { databaseGetProjects, databaseGetProjectByInvite, databaseCreateProject, databaseGetProjectsByUsername, databaseJoinProject, databaseAddClock };
