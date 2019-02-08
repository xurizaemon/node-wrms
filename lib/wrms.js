/*
eslint
  no-process-env: off,
  promise/catch-or-return: off,
  promise/prefer-await-to-then: off,
  promise/always-return: off,
  promise/no-nesting: off,
  no-param-reassign: off,
  no-shadow: off,
  no-constant-condition: off,
  prefer-promise-reject-errors: off,
  no-extra-boolean-cast: off,
  no-unused-vars: off
*/
const request = require("request-promise-native");
const pjson = require("../package.json");

const WRMS = function(params) {
  this.headers = {
    "User-Agent": `node-wrms/${pjson.version}`
  };

  this.endpoint = params.endpoint;
  this.username = params.username;
  this.password = params.password;

  this.jar = request.jar();

  this.urlForPath = path => {
    return `${this.endpoint}/${path}`;
  };

  this.reformatApi1Response = response => {
    return {
      response: response
    };
  };

  this.defaultApiCall = (path, options = {}, debug = false) => {
    // eslint-disable no-param-reassign
    options = {
      ...this.defaultRequestOptions,
      ...options,
      ...{ url: this.urlForPath(path) }
    };
    return this.login().then(() => {
      return request(options).then(body => {
        let response = JSON.parse(body);
        if (response) {
          if (debug) {
            console.log({ options: options, response: response });
          }
          // Wrap APIv1 responses nicely.
          if (typeof response.response === "undefined") {
            response = this.reformatApi1Response(response);
          }
          return Promise.resolve(response);
        }
        return Promise.reject(`Unable to parse: ${body}`);
      });
    });
  };

  this.defaultRequestOptions = () => {
    return {
      insecure: Boolean(process.env.WRMS_SSL_INSECURE),
      rejectUnauthorized: !Boolean(process.env.WRMS_SSL_INSECURE),
      jar: this.jar
    };
  };

  this.hasAuthCookie = () => {
    let hasAuthCookie = false;
    this.jar.getCookies(this.endpoint).forEach(cookie => {
      if (cookie.key === "wrms3_auth") {
        hasAuthCookie = true;
      }
    });
    return hasAuthCookie;
  };

  this.login = () => {
    if (!this.hasAuthCookie()) {
      let options = this.defaultRequestOptions();

      options = {
        ...options,
        ...{
          method: "POST",
          url: this.urlForPath("api2/login"),
          formData: {
            username: this.username,
            password: this.password
          }
        }
      };

      request(options);

      // Authenticate to WRMS v2 (API v1) as well.
      const phpOpts = options;
      phpOpts.url = this.urlForPath("login.php");
      phpOpts.resolveWithFullResponse = true;
      phpOpts.simple = false;
      return request(phpOpts);
    }
    return Promise.resolve();
  };

  this.logout = () => {};

  this.user = {
    lookup: params => {
      let options = this.defaultRequestOptions();
      options = {
        ...options,
        ...{
          headers: this.headers,
          method: "GET",
          qs: params
        }
      };
      return this.defaultApiCall("api2/user_lookup", options);
    },

    update: params => {},

    create: params => {},

    roles: {
      update: params => {}
    },

    system_roles: {
      update: params => {}
    }
  };

  this.organisation = {
    create: params => {},

    update: params => {},

    system: {
      update: params => {}
    }
  };

  this.report = {
    saved: params => {},

    get: params => {},

    // Get a report's configuration.
    configuration: params => {}
  };

  this.notifications = {
    get: params => {},

    mark: params => {}
  };

  this.system = {
    create: params => {},

    update: params => {}
  };

  this.timesheet = {
    record: params => {
      let options = this.defaultRequestOptions();
      options = {
        ...options,
        ...{
          headers: this.headers,
          method: "POST",
          form: params
        }
      };
      return this.defaultApiCall("api.php/times/record", options);
    },

    recent: () => {
      let options = this.defaultRequestOptions();
      options = {
        ...options,
        ...{
          headers: this.headers,
          method: "GET"
        }
      };
      return this.defaultApiCall("api.php/activities/recent", options);
    },

    update: params => {},

    my_last_2_weeks: params => {
      let options = this.defaultRequestOptions();
      params.output_format = 'json';
      params.report_type = "timesheet";
      params.display_fields = "request_id,brief,organisation_name,hours_sum";
      params.worker_id = "MY_USER_ID";
      params.created_date = "w-26";
      options = {
        ...options,
        ...{
          headers: this.headers,
          method: "GET",
          qs: params
        }
      };
      return this.defaultApiCall("api2/report", options);
    }
  };

  this.work_request = {
    search: params => {
      // Minimal params: { q: 'searchterm' }
      let options = this.defaultRequestOptions();
      options = {
        ...options,
        ...{
          headers: this.headers,
          method: "GET",
          qs: params
        }
      };
      return this.defaultApiCall("api2/search", options);
    },

    get: id => {
      let options = this.defaultRequestOptions();
      options = {
        ...options,
        ...{
          headers: this.headers,
          method: "GET"
        }
      };
      return this.defaultApiCall(`api2/request/${id}`, options);
    },

    // API `api2/request_update` returns formatted but basically empty JSON,
    // you can see this used updating WRs in Kanban view.
    update: params => {
      let options = this.defaultRequestOptions();
      options = {
        ...options,
        ...{
          headers: this.headers,
          method: "POST",
          form: params
        }
      };
      return this.defaultApiCall("api2/request_update", options);
    },

    add_tags: params => {},

    remove_tags: params => {},

    subscribe: params => {},

    unsubscribe: params => {},

    allocate: params => {},

    deallocate: params => {}
  };

  return this;
};

module.exports = WRMS;
