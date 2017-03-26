const Bot = require('slackbots');
const OptimizelyBot = require('./lib');


if (!process.env.UPDATE_CHANNEL) {
  console.error('Missing `UPDATE_CHANNEL` environment variable');
  process.exit(-1);
}

// Interval to listen for changes.
global.listenInterval = 60000;

// Making the bot global to avoid multiple instanciation.
global.bot = new Bot(require('./config/bot'));

// Making the function global.
global.notify = (message) => bot.postMessageToChannel(process.env.UPDATE_CHANNEL, message);

// Running the bot.
OptimizelyBot.run();
