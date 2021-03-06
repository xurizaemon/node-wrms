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

describe("Work Request API", () => {
  const wrId = testConfig.data.testWorkRequestId;
  const subject = testData.testWorkRequestSubject;
  const searchTerm = testData.testWorkRequestSearchTerm;

  test(`Work request search [${searchTerm}]`, done => {
    const params = {
      q: searchTerm
    };
    wrms.work_request.search(params).then(res => {
      expect(typeof res.response.body).toBe("object");
      expect(res.response.body.length).toBeGreaterThan(0);
      done();
    });
  });

  test(`Work request get [${wrId}]`, done => {
    wrms.work_request.get(wrId).then(res => {
      expect(typeof res.response.detailed).toBe("string");
      done();
    });
  });

  // Ensure we can get a WR subject.
  // eslint-disable-line max-len
  test(`WR#${wrId} subject is ["${subject}"]`, done => {
    wrms.work_request.get(wrId).then(res => {
      expect(res.response.brief).toBe(subject);
      done();
    });
  });
});

describe("Work Request API - relations", () => {
  const childId = testConfig.data.testWorkRequestId;
  const parentId = testConfig.data.testWorkRequestParentId;

  // Ensure child WR does not have parent WR.
  beforeEach(() => {
    wrms.work_request.get(childId).then(res => {
      const parents = res.response.parents_by_type.I || undefined;
      if (typeof parents !== "undefined" && parents.includes(parentId)) {
        const params = {};
        params.request_id = childId;
        const newParents = parents.filter(id => {
          return id !== parentId;
        });
        params.parents_i = newParents.join();
        params.send_no_email = "on";
        wrms.work_request.update(params).then(() => {
          return Promise.resolve();
        });
      }
      return Promise.resolve();
    });
  });

  // Ensure child WR can be assigned parent WR.
  test(`Link work requests [${childId}] and [${parentId}]`, done => {
    const parents = [];
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
      })
      .then(() => {
        done();
      });
  });
});

describe("Work Request API - query", () => {
  test(`Work request query`, done => {
    const params = {
      system: testConfig.data.testSystemId,
      order_by: "-last_activity",
      page_size: 5
    };

    wrms.work_request.query(params).then(res => {
      expect(typeof res.response.request).toBe("object");
      expect(res.response.request.length).toBe(5);
      done();
    });
  });
});
