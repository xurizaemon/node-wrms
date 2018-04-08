const request = require('request-promise-native');

const FOO = function(creds) {
  let self = this;

  this.endpoint = creds.endpoint;
  this.username = creds.username;
  this.password = creds.password;

  this.urlForPath = function(path) {
    return this.endpoint + '/' + path;
  }

  this.login = function() {
    var options = {
      url: this.urlForPath('api2/login'),
      formData: {
        username: this.username,
        password: this.password
      }
    };
    return request(options)
      .then(function(body) {
        self.cookie = JSON.parse(body).sess_id;
      });
  }

  return this;
}

module.exports = FOO;
