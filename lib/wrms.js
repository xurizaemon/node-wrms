/**
 * WRMS API wrapper.
 */
const request = require('request');

var WRMS = function(args) {
  var self = this;

  this.api = {
    user: {
      lookup: function(callback) {
        return self.request('/api2/user_lookup', 'GET', function(err, users) {
          callback(err, accounts);
        });
      }
    }
  };

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

      var options = {
        method: 'POST',
        url: args.url + 'api2/login',
        headers: { 'content-type': 'multipart/form-data; boundary=---011000010111000001101001' },
        formData: { username: args.username, password: args.password }
      };

      request(options, function (error, response, body) {
        if (error) {
          throw new Error(error);
        }

        var result = JSON.parse(body);
        this.auth_cookie = result.response.auth_cookie_value;
      });
    }
  };

  this.authenticate(args);
  return this;
};

module.exports = WRMS;
