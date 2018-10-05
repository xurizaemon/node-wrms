'use strict';

/**
 * WRMS API wrapper.
 */
const request = require('request-promise-native')
const pjson = require('../package.json')

var WRMS = function (params) {
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

  // Create default API calls which look something like this:
  this.defaultApiCall = () => {
    let options = this.defaultRequestOptions()
    options = { ...options, ...{
        headers: this.headers,
        method: 'GET',
        // url: this.urlForPath(''),
        // qs: params
      }
    }
    return this.login().then(() => {
      return request(options)
        .then((body) => {
          return Promise.resolve(JSON.parse(body))
        })
    })
  }
  // Then make each API call derive from that, with params / url overridden.
  // Check out https://gitlab.com/mataara/Mataara-Server/blob/290726446945ae9cf7fb0616850d6eb8a6ab0bf0/archimedes/frontend/src/api.js#L24

  this.defaultRequestOptions = () => {
    return {
      insecure: Boolean(process.env.WRMS_SSL_INSECURE),
      rejectUnauthorized: !Boolean(process.env.WRMS_SSL_INSECURE)
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
      let options = this.defaultRequestOptions()
      options = { ...options, ...{
          headers: this.headers,
          method: 'GET',
          url: this.urlForPath('/api2/user_lookup'),
          qs: params
        }
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
    record: (params) => {
      // Endpoint is api.php/times/record
      // POST looks like this:
      // {
      //   "work_on": "2018-10-1",
      //   "request_id": 277853,
      //   "work_description": "Timesheeting",
      //   "hours": 0.1,
      //   "CSRFToken": "826e91e4293cc9b8e3c502230def7f57f98346cafe09f3a07c28c37b68256853af3666a7f09c81870f892f50db21826b52a83f46725d3d66a7fee2b55398cee0"
      // }
    },

    update: (params) => {

    },

    recent: () => {
      let options = this.defaultRequestOptions()
      options = { ...options, ...{
          headers: this.headers,
          method: 'GET',
          url: this.urlForPath('api.php/activities/recent')
        }
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
      let options = this.defaultRequestOptions()
      options = { ...options, ...{
          headers: this.headers,
          method: 'GET',
          url: this.urlForPath('api2/search'),
          qs: params
        }
      }
      return this.login().then(() => {
        return request(options)
          .then((body) => {
            return Promise.resolve(JSON.parse(body))
          })
      })
    },

    get: (id) => {
      let options = this.defaultRequestOptions()
      options = { ...options, ...{
          headers: this.headers,
          method: 'GET',
          url: this.urlForPath(`api2/request/${id}`)
        }
      }
      return this.login().then(() => {
        return request(options)
          .then((body) => {
            return Promise.resolve(JSON.parse(body))
          })
      })
    },

    update: (params) => {
      let options = this.defaultRequestOptions()
      options = { ...options, ...{
          headers: this.headers,
          method: 'POST',
          url: this.urlForPath('api2/request_update'),
          form: params
          // values
        }
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
