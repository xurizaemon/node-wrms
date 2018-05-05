/**
 * WRMS API wrapper.
 */
const request = require('request-promise-native')
const pjson = require('../package.json')

const WRMS = function (params) {
  this.headers = {
    'User-Agent': `node-wrms/${pjson.version}`
  }

  this.endpoint = params.endpoint
  this.username = params.username
  this.password = params.password

  this.urlForPath = (path) => {
    return this.endpoint + '/' + path
  }

  this.login = () => {
    if (typeof (this.headers.Cookie === 'undefined')) {
      var options = {
        method: 'POST',
        url: this.urlForPath('api2/login'),
        formData: {
          username: this.username,
          password: this.password
        }
      }
      return request(options)
        .then((body) => {
          this.wrms3_auth_cookie = JSON.parse(body).response.auth_cookie_value
          this.headers.Cookie = `wrms3_auth=${this.wrms3_auth_cookie}`
        })
    }
    else {
      return Promise.resolve()
    }
  }

  this.user = {
    lookup: (params) => {
      var options = {
        headers: this.headers,
        method: 'GET',
        url: this.urlForPath('/api2/user_lookup'),
        qs: params
      }
      return this.login().then(() => {
        return request(options)
          .then((body) => {
            return Promise.resolve(JSON.parse(body))
          })
      })
    }
  }

  this.work_request = {
    search: (params) => {
      // minimal params: { q: 'searchterm' }
      var options = {
        headers: this.headers,
        method: 'GET',
        url: this.urlForPath('api2/search'),
        qs: params
      }
      return this.login().then(() => {
        return request(options)
          .then((body) => {
            return Promise.resolve(JSON.parse(body))
          })
      })
    },

    get: (id) => {
      var options = {
        headers: this.headers,
        method: 'GET',
        url: this.urlForPath(`api2/request/${id}`)
      }
      return this.login().then(() => {
        return request(options)
          .then((body) => {
            return Promise.resolve(JSON.parse(body))
          })
      })
    }
  }

  return this
}

module.exports = WRMS
