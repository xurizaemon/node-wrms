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

describe("Organisation API", () => {
  test(`Get organisation by id`, done => {
    const organisationId = testData.testOrganisationId;
    wrms.organisation.get(organisationId).then(res => {
      expect(typeof res.response.organisation.name).toBe("string");
      expect(res.response.organisation.name).toBe(
        testData.testOrganisationName
      );
      done();
    });
  });

  test(`Organisation query by name`, done => {
    const params = {
      name: testData.testOrganisationName
    };

    wrms.organisation.query(params).then(res => {
      expect(typeof res.response.organisation).toBe("object");
      expect(res.response.organisation[0].org_code).toBe(
        testData.testOrganisationId
      );
      done();
    });
  });
});
