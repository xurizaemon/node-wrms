# WRMS interface

An API wrapper interface to WRMS.

## Tests

Credentials for tests live in `.env`. These need to be valid for your WRMS environment.

    WRMS_URL=https://wrms.example.org
    WRMS_USERNAME=exampleuser
    WRMS_PASSWORD=secretpass
    WRMS_TEST_USER_MAIL=user@example.org

## TODO

* Permit `new wrms(creds)` to accept `{ endpoint: 'xx', wrms3_auth: 'xyz' }` if we already have a cookie. (Is this a good idea or does it encourage bad ones?)
