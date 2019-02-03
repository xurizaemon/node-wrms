/*
eslint
  no-process-env: off,
  promise/catch-or-return: off,
  promise/prefer-await-to-then: off,
  promise/always-return: off
*/
const WRMS = require("./wrms");
const testConfig = require("./config-test");
const wrms = new WRMS(testConfig.creds);

test("Login sets a cookie", done => {
  wrms.login().then(() => {
    expect(typeof wrms.wrms3_auth_cookie).toBe("string");
    expect(typeof wrms.headers.Cookie).toBe("string");
    done();
  });
});
