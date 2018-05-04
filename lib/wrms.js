/**
 * WRMS API wrapper.
 */
const request = require('request-promise-native')
const pjson = require('../package.json')

const WRMS = function (params) {
  let self = this;

  this.headers = {
    'User-Agent': `node-wrms/${pjson.version}`
  }

  this.endpoint = params.endpoint
  this.username = params.username
  this.password = params.password
  // @TODO: Pass in current auth cookie instead of user/pass?

  this.urlForPath = function (path) {
    return self.endpoint + '/' + path;
  };

  this.login = function () {
    if (typeof (this.headers.Cookie === 'undefined')) {
      var options = {
        method: 'POST',
        url: this.urlForPath('api2/login'),
        formData: {
          username: this.username,
          password: this.password
        }
      };
      return request(options)
        .then(function (body) {
          self.wrms3_auth_cookie = JSON.parse(body).response.auth_cookie_value;
          self.headers.Cookie = `wrms3_auth=${self.wrms3_auth_cookie}`;
        });
    }
    else {
      return Promise.resolve();
    }
  };

  this.user = {
    lookup: (params) => {
      var options = {
        headers: self.headers,
        method: 'GET',
        url: self.urlForPath('/api2/user_lookup'),
        qs: params
      };
      return this.login().then(() => {
        return request(options)
          .then((body) => {
            // console.log(body)
            const res = JSON.parse(body)
            // console.log(res)
            return Promise.resolve(res)
          })
      })
    }
  }

  return this
}

module.exports = WRMS
