/**
 * WRMS API wrapper.
 */
const request = require('request-promise-native');

const WRMS = function(params) {
  let self = this;

  this.headers = {
    'User-Agent': 'node-wrms/0.0.1'
  };

  this.endpoint = params.endpoint;
  this.username = params.username;
  this.password = params.password;

  this.urlForPath = function(path) {
    return self.endpoint + '/' + path;
  };

  this.login = function() {
    var options = {
      method: 'POST',
      url: this.urlForPath('api2/login'),
      formData: {
        username: this.username,
        password: this.password
      }
    };
    return request(options)
      .then(function(body) {
        self.wrms3_auth_cookie = JSON.parse(body).response.auth_cookie_value;
        self.headers.Cookie = `wrms3_auth=${self.wrms3_auth_cookie}`;
      });
  };

  this.user = {
    lookup: function(params) {
      var options = {
        headers: self.headers,
        method: 'GET',
        url: self.urlForPath('/api2/user_lookup'),
        qs: params
      };
      return request(options);
    }
  };

  return this;
};

module.exports = WRMS;
