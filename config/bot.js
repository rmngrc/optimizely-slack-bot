const Bot = require('slackbots');


if (!process.env.SLACK_TOKEN) {
  console.error('Missing `SLACK_TOKEN` environment variable');
  process.exit(-1);
}

module.exports = new Bot({
  name: 'Optimizely Bot',
  token: process.env.SLACK_TOKEN,
});
