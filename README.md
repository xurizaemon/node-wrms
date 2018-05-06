# WRMS interface

An API wrapper interface to WRMS.

## Usage

```JavaScript
const WRMS = require('wrms')
const wrms = new WRMS({
                        endpoint: 'https://wrms.example.org',
                        username: 'username',
                        password: 'password'
                      })

wrms.user.lookup({field: 'email', key: 'user@example.org'})
    .then((res) => {
        // res is a resultset of users
    })

wrms.work_request.search({q: 'search term'})
    .then((res) => {
        // res is a resultset of work requests
    })
```

## Tests

Credentials for tests live in `.env`. These need to be valid for your WRMS environment (eg `WRMS_TEST_USER_MAIL` will be an existing user's email). See tests for more.

    WRMS_URL=https://wrms.example.org
    WRMS_USERNAME=exampleuser
    WRMS_PASSWORD=secretpass
    WRMS_TEST_USER_MAIL=user@example.org
    WRMS_TEST_WR_SEARCH_TERM="search term"
    WRMS_TEST_WR_ID=123

## TODO

* Permit `new WRMS(creds)` to accept `{ endpoint: 'xx', wrms3_auth: 'xyz' }` if we already have a cookie. (Is this a good idea or does it encourage bad ones?)
* Split tests into separate files for clarity? Eg `wrms.login.test.js`, `wrms.work_request.test.js` ...
* Do we need WRMSv2 API endpoints? Seems like there are some useful parts there, like "recent timesheets".
