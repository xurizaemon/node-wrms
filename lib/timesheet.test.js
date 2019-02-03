/*
eslint
  no-process-env: off,
  promise/catch-or-return: off,
  promise/prefer-await-to-then: off,
  promise/always-return: off
*/
const skipIf = require("skip-if");
const WRMS = require("./wrms");
const testConfig = require("./config-test");
const wrms = new WRMS(testConfig.creds);

// APIv1 calls fail with permission denied if WRMS_EXTRA_COOKIES not provided.
const skipV1Api = typeof process.env.WRMS_EXTRA_COOKIES === "undefined";

// Timesheets (WRMSv2 API).
skipIf(skipV1Api, `Timesheet has recent entries [v2 API]`, done => {
  wrms.timesheet.recent().then(res => {
    expect(typeof res.response).toBe("object");
    done();
  });
});
