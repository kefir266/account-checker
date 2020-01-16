const axios = require('axios');

module.exports.getAccount = function (params) {
  const request = {
    method: 'GET',
    responseType: 'json',
    url: params.url,
    headers: {
      Connection: 'keep-alive',
      'Accept-Language': 'ru-RU',
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'X-CSRF-TOKEN': params['X-CSRF-TOKEN'],
      Referer: 'https://ubank.bankvostok.com.ua/',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.3'
    }
  };
  return axios(request)
};