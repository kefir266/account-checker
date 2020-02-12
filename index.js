const TeleBot = require('telebot');
const vostokService = require('./vostok-service');
require('dotenv').config({ path: `${__dirname}/.env` });

const REQUEST_TIME_INTERVAL = process.env.REQUEST_TIME_INTERVAL || 60000;

let lastStatus;
let lastSuccess;
let idSetInterval;
const bot = new TeleBot({
  token: process.env.TOKEN || '', // Required. Telegram Bot API token.
  polling: { // Optional. Use polling.
    interval: 1000, // Optional. How often check updates (in ms).
    timeout: 0, // Optional. Update polling timeout (0 - short polling).
    limit: 100, // Optional. Limits the number of updates to be retrieved.
    retryTimeout: 5000, // Optional. Reconnecting timeout (in ms).
  },
  // webhook: { // Optional. Use webhook instead of polling.
  //   key: 'key.pem', // Optional. Private key for server.
  //   cert: 'cert.pem', // Optional. Public key.
  //   url: 'https://....', // HTTPS url to send updates to.
  //   host: '0.0.0.0', // Webhook server host.
  //   port: 443, // Server port.
  //   maxConnections: 40 // Optional. Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery
  // },
  allowedUpdates: [], // Optional. List the types of updates you want your bot to receive. Specify an empty list to receive all updates.
  usePlugins: ['askUser'], // Optional. Use user plugins from pluginFolder.
  pluginFolder: '../plugins/', // Optional. Plugin folder location.
  pluginConfig: { // Optional. Plugin configuration.
    // myPluginName: {
    //   data: 'my custom value'
    // }
  }
});

bot.on(['/start', '/hello'], check_account);
bot.on(['/check-healthy'], (msg) => {
  console.log(msg.text);
  if (lastStatus) {
    msg.reply.text(`All right! I'm healty! Last status: ${lastStatus} at ${lastSuccess}`);
  } else {
    msg.reply.text('There aren\'t last status');
  }
});

bot.start();

function check_account(msg) {

  console.log(msg.text);
  const chat = msg.chat.id;

  clearInterval(idSetInterval);
  const message = msg.text.split(' ');
  if (message.length !==2) {
    msg.reply.text('Bad request');
    return;
  }
  const params = parseUrl(Buffer.from(message[1], 'base64').toString());
  if (!params) {
    msg.reply.text('Bad request');
    return;
  }
  vostokService.getAccount(params)
    .then(res => {
      lastStatus = res;
      msg.reply.text(res);
    })
    .catch((err) => {
      msg.reply.text(err);
      console.error(err);
    });

  if (idSetInterval) {
    clearInterval(idSetInterval);
  }
  idSetInterval = setInterval(() => {
    vostokService.getAccount(params)
      .then(res => {
        if (res && lastStatus && res.length !== lastStatus.length && res !== lastStatus) {
          console.log('============================BINGO========================================');
          console.log(res);
          bot.sendMessage(chat.id, res);
        }
        lastStatus = res;
        lastSuccess = new Date();
      })
      .catch((err) => {
        console.error(err);
      });
    }, REQUEST_TIME_INTERVAL);

}

function parseUrl(url) {
  const res = /('(https:\/\/ubank.bankvostok\.com\.ua\/\w+.+;jsessionid=\w+).+X-CSRF-TOKEN:\s*(\w+).+)/.exec(url);
  if (res && res.length > 2) {
    return {
      fullArgs: res[1],
      url: res[2],
      'X-CSRF-TOKEN': res[3]
    }
  }
  return null
}
