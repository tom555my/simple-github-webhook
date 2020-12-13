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
  const body = await json(req);
  if (body.ref == null) {
    send(res, 400, {
      error: 'missing-ref',
    });
    return;
  }
  const branch = body.ref.split('/')[body.ref.split('/').length - 1];
  if (!Object.keys(config).includes(branch)) {
    send(res, 400, {
      error: `No CMD for branch ${branch}`,
    });
    return;
  }
  for (let index = 0; index < config[branch].cmd.length; index++) {
    const command = config[branch].cmd[index];
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
