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

  this.reformatApi2Response = (response) => {
    return {
      response: response
    }
  }

  this.defaultRequestOptions = () => {
    return {
      insecure: process.env.WRMS_SSL_INSECURE || false
    }
  }

  this.login = () => {
    if (typeof (this.headers.Cookie === 'undefined')) {
      let options = this.defaultRequestOptions()

      options = { ...options, ...{
          method: 'POST',
          url: this.urlForPath('api2/login'),
          formData: {
            username: this.username,
            password: this.password
          }
        }
      }

      console.log(options)
      return request(options)
        .then((body) => {
          this.wrms3_auth_cookie = JSON.parse(body).response.auth_cookie_value
          this.headers.Cookie = `wrms3_auth=${this.wrms3_auth_cookie}`
          // Need to sort out how to auth for WRMSv2 API endpoints too.
          if (typeof process.env.WRMS_EXTRA_COOKIES !== 'undefined') {
            this.headers.Cookie += process.env.WRMS_EXTRA_COOKIES
          }
        })
    }
    else {
      return Promise.resolve()
    }
  }

  this.logout = () => {

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
    },

    update: (params) => {},

    create: (params) => {},

    roles: {
      update: (params) => {}
    },

    system_roles: {
      update: (params) => {}
    }
  }

  this.organisation = {
    create: (params) => {},

    update: (params) => {},

    system: {
      update: (params) => {}
    }
  }

  this.report = {
    saved: (params) => {},

    get: (params) => {},

    // Get a report's configuration.
    configuration: (params) => {}
  }

  this.notifications = {
    get: (params) => {},

    mark: (params) => {}
  }

  this.system = {
    create: (params) => {},

    update: (params) => {}
  }

  this.timesheet = {
    update: (params) => {},

    recent: () => {
      var options = {
        headers: this.headers,
        method: 'GET',
        url: this.urlForPath('api.php/activities/recent')
      }
      return this.login().then(() => {
        return request(options)
          .then((body) => {
            return Promise.resolve(this.reformatApi2Response(JSON.parse(body)))
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
    },

    add_tags: (params) => {},

    remove_tags: (params) => {},

    subscribe: (params) => {},

    unsubscribe: (params) => {},

    allocate: (params) => {},

    deallocate: (params) => {}
  }

  return this
}

module.exports = WRMS
