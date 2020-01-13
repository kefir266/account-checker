const axios = require('axios');

module.exports.getAccount = function (params) {
  const request = {
    method: 'GET',
    responseType: 'json',
    url: `https://ubank.bankvostok.com.ua/uweb/protected/reference/accs_info;jsessionid=${params.sessioonId}`,
    headers: {
      'X-CSRF-TOKEN': params['X-CSRF-TOKEN']
    }
  };
  return axios(request)
};