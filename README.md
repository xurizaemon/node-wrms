# WRMS interface

An API wrapper interface to WRMS.

## TODO

Pass in WRMS configuration.

    var WRMS = require('wrms');
    var creds = {
      username: 'example',
      password: 'example',
      url: 'https://wrms.example.org'
    };
    var wrms = WRMS(creds);
