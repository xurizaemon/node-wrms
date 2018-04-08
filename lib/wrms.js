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
    return this.endpoint + '/' + path;
  }

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
  }

  this.user = {
    lookup: function(params) {
      var options = {
        headers: self.headers,
        method: 'GET',
        url: self.url + '/api2/user_lookup'
      };
      console.log(options, 'o');
      return request(options) {
        var result = JSON.parse(body);
        callback(result);
      });
    }
  };

  return this;
}

module.exports = WRMS;

/*
WRMS.prototype.

  var self = this;

  this.request = function (path, method, form_data, callback) {
    console.log(this, 'this');
    if (typeof self.auth_cookie === 'undefined') {
      throw new Error('Not authenticated to WRMS');
    }
  };

  this.authenticate = function(args) {
    // If auth_cookie is passed in, bypass login.
    if (typeof args.auth_cookie !== 'undefined') {
      this.auth_cookie = args.auth_cookie;
    }
    else {
      this.username = args.username;
      this.password = args.password;
      this.url = args.url;

      var options = {
        method: 'POST',
        url: args.url + 'api2/login',
        headers: { 'content-type': 'multipart/form-data; boundary=---1001011010101110011110001' },
        formData: {
          username: args.username,
          password: args.password
        }
      };

      return request(options, function (error, response, body) {
        if (error) {
          throw new Error(error);
        }

        var result = JSON.parse(body);
        this.auth_cookie = result.response.auth_cookie_value;
        this.auth_headers = { 'Cookie': 'wrms3_auth=' + this.auth_cookie };
      }).then(function() {
        return self;
      });
    }
  };

  this.api = {
    user: {
      lookup: function(params, callback) {
        var options = {
          headers: self.auth_headers,
          method: 'GET',
          url: self.url + '/api2/user_lookup'
        };
        console.log(options, 'o');
        request(options, function(err, response, body) {
          if (err) {
            throw new Error(err);
          }
          var result = JSON.parse(body);
          callback(result);
        });
      }
    }
  };

  return this.authenticate(args);
};
*/
