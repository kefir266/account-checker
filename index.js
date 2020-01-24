const TeleBot = require('telebot');
const vostokService = require('./vostok-service');

const bot = new TeleBot({
  token: '331602050:AAFskBjFM-AeIwHph5-suhx_IMaMuJwzBgc', // Required. Telegram Bot API token.
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

bot.start();

function check_account(msg) {
  let lastStatus;
  const params = parseUrl(msg);
  vostokService.getAccount(params)
    .then(res => {
      lastStatus = res;
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
  setInterval(() => {
    vostokService.getAccount(params)
      .then(res => {
        if (res.length !== lastStatus.length && compare(res, lastStatus)) {
          msg.reply.text(res);
        }
        lastStatus = res.data
      })
      .catch((err) => {
        console.error(err);
      });
    }, 60000);

}

function parseUrl(url) {
  const res = /('(https:\/\/ubank.bankvostok\.com\.ua\/\w+.+;jsessionid=\w+).+X-CSRF-TOKEN:\s*(\w+).+)/.exec(url.text);
  if (res && res.length > 2) {
    return {
      fullArgs: res[1],
      url: res[2],
      'X-CSRF-TOKEN': res[3]
    }
  }
  return null
}

function compare(data1, data2) {
  return true
}