/**
 * WRMS API wrapper.
 */
const request = require('request-promise-native');

var WRMS = function(args) {
  var self = this;

  this.request = function (path, method, form_data, callback) {
    if (typeof self.auth_cookie === 'undefined') {
      throw new Error('Not authenticated to WRMS');
    }
  };

  this.authenticate = function(args) {
    return new Promise(function(resolve, reject) {
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

        self.some_thing = 'true';
        request(options, function (error, response, body) {
          if (error) {
            reject(error);
          }

          var result = JSON.parse(body);
          self.auth_cookie = result.response.auth_cookie_value;
          self.auth_headers = { 'Cookie': 'wrms3_auth=' + this.auth_cookie };
          resolve(self);
        });
      }
    });
  };

  this.api = {
    user: {
      lookup: function(params, callback) {
        var options = {
          headers: self.auth_headers,
          method: 'GET',
          url: self.url + '/api2/user_lookup'
        };
        // console.log(options, 'o');
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

  // console.log(this, 'this');
  this.authenticate(args);
  return self;
};

module.exports = WRMS;
