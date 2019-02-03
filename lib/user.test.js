/*
eslint
  no-process-env: off,
  promise/catch-or-return: off,
  promise/prefer-await-to-then: off,
  promise/always-return: off
*/
const WRMS = require("./wrms");
const testConfig = require("./config-test");
const testData = testConfig.data;
const wrms = new WRMS(testConfig.creds);

test(`User lookup for [${testData.testUserMail}] returns users`, done => {
  const params = {
    field: "email",
    key: testData.testUserMail
  };
  wrms.user.lookup(params).then(res => {
    expect(typeof res.response).toBe("object");
    expect(res.response.users.length).toBeGreaterThan(1);
    done();
  });
});
