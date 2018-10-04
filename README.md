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

But wait! There's more variables you can set in `.env`:

* `WRMS_SSL_INSECURE=true` when someone forgets to renew a cert
* `WRMS_EXTRA_COOKIES="foo=bar; secret=very; much=authentication"` when you need to talk to WRMSv2 (timesheet API)

## TODO

* Permit `new WRMS(creds)` to accept `{ endpoint: 'xx', wrms3_auth: 'xyz' }` if we already have a cookie. (Is this a good idea or does it encourage bad ones?)
* Split tests into separate files for clarity? Eg `wrms.login.test.js`, `wrms.work_request.test.js` ...
* Do we need WRMSv2 API endpoints? Seems like there are some useful parts there, like "recent timesheets".
* If `WRMS_EXTRA_COOKIES` isn't set, politely reject calls to v2 API.
* [`docs/assign-user.js`](docs/assign-user.js) - WRMS forms don't let you easily assign a user to a ticket outside their systems, but I suspect API will.

## References

* [WRMS3](https://gitlab.wgtn.cat-it.co.nz/WRMS/wrms3)
* [WRMS api v2](https://gitlab.wgtn.cat-it.co.nz/WRMS/wrms3/tree/master/wrms/pages)
* [PHP client libs](https://gitlab.wgtn.cat-it.co.nz/WRMS/wrms-php)
* [Perl client libs](http://gitprivate.catalyst.net.nz/gw?p=libwrms-perl.git;a=summary)
* [WR#286231: Port wr.php to WRMSv3 and make it API driven](https://wrms.catalyst.net.nz/286231) 
