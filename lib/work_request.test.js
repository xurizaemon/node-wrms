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

test(`Work request search [${testData.testWorkRequestSearchTerm}]`, done => {
  const params = {
    q: testData.testWorkRequestSearchTerm
  };
  wrms.work_request.search(params).then(res => {
    expect(typeof res.response.body).toBe("object");
    expect(res.response.body.length).toBeGreaterThan(0);
    done();
  });
});

test(`Work request get [${testData.testWorkRequestId}]`, done => {
  wrms.work_request.get(testData.testWorkRequestId).then(res => {
    expect(typeof res.response.detailed).toBe("string");
    done();
  });
});

// Ensure we can get a WR subject.
// eslint-disable-line max-len
test(`WR#${testData.testWorkRequestId} subject is ["${testData.testWorkRequestSubject}"]`, done => {
  wrms.work_request.get(testData.testWorkRequestId).then(res => {
    expect(res.response.brief).toBe(testData.testWorkRequestSubject);
    done();
  });
});
