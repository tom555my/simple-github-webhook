const { json, send } = require('micro');
const config = require('./config.json');
const exec = require('child_process').exec;

const execAsync = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error.message);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout);
    });
  });

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    send(res, 404, 'Not Found');
    return;
  }
  const repos = Object.keys(config);
  const body = await json(req);
  const repo = body.repository.name;
  if (!repos.includes(repo)) {
    send(res, 404, 'Not Found');
    return;
  }
  if (body.ref == null) {
    send(res, 400, {
      error: 'missing-ref',
    });
    return;
  }
  const branch = body.ref.split('/')[body.ref.split('/').length - 1];
  if (!Object.keys(config[repo]).includes(branch)) {
    send(res, 400, {
      error: `No CMD for branch ${branch}`,
    });
    return;
  }
  const commands = config[repo][branch].cmd;
  for (let index = 0; index < commands.length; index++) {
    const command = commands[index];
    try {
      const output = await execAsync(command);
      send(res, 200, { message: output });
    } catch (error) {
      send(res, 400, {
        error,
      });
      return;
    }
  }
  res.end('Done exec');
};

// cd ~/chatbot-server && bash deploy.sh
