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

describe("Login integration tests.", () => {
  test("Login sets a cookie", done => {
    wrms.login().then(() => {
      expect(wrms.hasAuthCookie()).toBe(true);
      done();
    });
  });
});
