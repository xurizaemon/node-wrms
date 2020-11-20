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

describe("Timesheet API.", () => {
  test(`Timesheet has recent entries [v2 API]`, done => {
    wrms.timesheet.recent().then(res => {
      expect(typeof res.response).toBe("object");
      done();
    });
  });
});
