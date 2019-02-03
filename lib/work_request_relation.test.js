/*
eslint
  no-process-env: off,
  promise/catch-or-return: off,
  promise/prefer-await-to-then: off,
  promise/always-return: off,
  promise/no-nesting: off,
  consistent-return: off
*/

// This test is a monster and probably wants a smarter way to express itself.
// For example, a setup which ensures the tickets are not related, then a
// test which ensures they are.

const WRMS = require("./wrms");
const testConfig = require("./config-test");
const testData = testConfig.data;
const wrms = new WRMS(testConfig.creds);

// Ensure a ticket has a parent.
test(`Link work requests [${testData.testWorkRequestId}] and [${
  testData.testWorkRequestParentId
}]`, done => {
  const parents = [];
  wrms.work_request
    .get(testData.testWorkRequestId)

    // Ensure testWorkRequestId is not a child of testWorkRequestParentId.
    .then(res => {
      if (
        typeof res.response.parents_by_type.I !== "undefined" &&
        res.response.parents_by_type.I.includes(
          testData.testWorkRequestParentId
        )
      ) {
        const wr = res.response;
        const params = {};
        params.request_id = testData.testWorkRequestId;
        const newParents = wr.parents_by_type.I.filter(id => {
          return id !== testData.testWorkRequestParentId;
        });
        params.parents_i = newParents.join();
        params.send_no_email = "on";
        return Promise.resolve(params);
      }
      return Promise.resolve();
    })
    .then(params => {
      if (params) {
        return wrms.work_request.update(params).then(res => {
          expect(res.success).toBe(true);
        });
      }
    })

    // Set testWorkRequestId to be a child of testWorkRequestParentId.
    .then(() => {
      // If the test WR already has that parent, remove it.
      return wrms.work_request.get(testData.testWorkRequestId).then(() => {
        const params = {};
        parents.push(testData.testWorkRequestParentId);
        params.request_id = testData.testWorkRequestId;
        params.parents_i = parents.join();
        params.send_no_email = "on";
        wrms.work_request.update(params).then(res => {
          expect(res.success).toBe(true);
        });
      });
    })

    // Check testWorkRequestId is a child of testWorkRequestParentId.
    .then(() => {
      return wrms.work_request.get(testData.testWorkRequestId).then(res => {
        const wr = res.response;
        expect(typeof wr.parents_by_type.I).toBe("object");
        expect(wr.parents_by_type.I).toEqual(
          expect.arrayContaining([testData.testWorkRequestParentId])
        );
      });
    })
    .then(() => {
      done();
    });
});
