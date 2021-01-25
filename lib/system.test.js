/*
eslint
  no-process-env: off,
  promise/catch-or-return: off,
  promise/prefer-await-to-then: off,
  promise/no-nesting: off,
  promise/always-return: off
*/
const WRMS = require("./wrms");
const testConfig = require("./config-test");
const testData = testConfig.data;
const wrms = new WRMS(testConfig.creds);

describe("System API", () => {
  test(`System get system by id`, done => {
    const systemId = testData.testSystemId;
    wrms.system.get(systemId).then(res => {
      expect(typeof res.response.system.system_desc).toBe("string");
      expect(res.response.system.system_desc).toBe(testData.testSystemName);
      done();
    });
  });

  test(`System query by system_desc`, done => {
    const params = {
      system_desc: testData.testSystemName
    };

    wrms.system.query(params).then(res => {
      expect(typeof res.response.system).toBe("object");
      expect(res.response.system[0].system_id).toBe(testData.testSystemId);
      done();
    });
  });
});
