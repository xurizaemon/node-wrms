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
const childId = testConfig.data.testWorkRequestId;
const parentId = testConfig.data.testWorkRequestParentId;
const wrms = new WRMS(testConfig.creds);

beforeEach(() => {
  wrms.work_request.get(childId).then(res => {
    const parents = res.response.parents_by_type.I || undefined;
    if (typeof parents !== "undefined" && parents.includes(parentId)) {
      const wr = res.response;
      const params = {};
      params.request_id = childId;
      const newParents = parents.filter(id => {
        return id !== parentId;
      });
      params.parents_i = newParents.join();
      params.send_no_email = "on";
      wrms.work_request.update(params).then(res => {
        return Promise.resolve(params);
      })
    }
    return Promise.resolve();
  });
});

// Ensure a ticket has a parent.
test(`Link work requests [${childId}] and [${parentId}]`, done => {
  const parents = [];
  wrms.work_request
    .get(childId)
    .then(() => {
      const params = {};
      parents.push(parentId);
      params.request_id = childId;
      params.parents_i = parents.join();
      params.send_no_email = "on";

      wrms.work_request
        .update(params)
        .then(res => {
          expect(res.success).toBe(true);
        })
        .then(() => {
          return wrms.work_request.get(childId).then(res => {
            const wr = res.response;
            expect(typeof wr.parents_by_type.I).toBe("object");
            expect(wr.parents_by_type.I).toEqual(
              expect.arrayContaining([parentId])
            );
          });
        });
    })
    .then(() => {
      done();
    });
});
