const axios = require('axios');
const { exec } = require('child_process');

module.exports.getAccount = function (params) {
  // const request = {
  //   method: 'GET',
  //   responseType: 'json',
  //   url: params.url,
  //   headers: {
  //     Connection: 'keep-alive',
  //     Pragma: 'no-cache',
  //     'Cache-Control': 'no-cache',
  //     'Sec-Fetch-Mode': 'cors',
  //     'Accept-Language': 'ru-RU',
  //     Accept: 'application/json, text/javascript, */*; q=0.01',
  //     'Accept-Encoding': 'gzip, deflate, br',
  //     'X-CSRF-TOKEN': params['X-CSRF-TOKEN'],
  //     Referer: 'https://ubank.bankvostok.com.ua/',
  //     'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.3',
  //     Cookie: params['Cookie']
  //   }
  // };
  // return axios(request)
  return new Promise((resolve) => {
    let response = '';
    const command = `curl ${params.fullArgs}\n`;
    console.log(command);
    exec(command, function (error, stdout, stderr) {
      console.log(stdout);
      response = stdout;
      resolve(stdout);
    });
    resolve(command);

  });
};