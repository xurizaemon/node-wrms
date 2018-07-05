// This test is a monster and probably wants a smarter way to express itself.

const WRMS = require('./wrms')
const testConfig = require('./config-test')
const testData = testConfig.data
const wrms = new WRMS(testConfig.creds)

// Ensure a ticket has a parent.
test(`Link work requests [${testData.testWorkRequestId}] and [${testData.testWorkRequestParentId}]`, done => {
  let parents = []
  wrms.work_request.get(testData.testWorkRequestId)
    .then((res) => {
      // If the test WR already has that parent, remove it.
      if (typeof res.response.parents_by_type.I !== 'undefined'
          && res.response.parents_by_type.I.includes(testData.testWorkRequestParentId)) {
            let wr = res.response
            let params = {}
            params.request_id = testData.testWorkRequestId
            let parents = wr.parents_by_type.I.filter(id => {
              return id != testData.testWorkRequestParentId
            })
            params.parents_i = parents.join()
            params.send_no_email = 'on'
            return Promise.resolve(params)
        }
        else {
          return Promise.resolve()
        }
      })
    .then(params => {
      if (params) {
        return wrms.work_request.update(params)
          .then((res) => {
            expect(res.success).toBe(true)
          })
      }
    })
    .then(() => {
      // If the test WR already has that parent, remove it.
      return wrms.work_request.get(testData.testWorkRequestId)
        .then((res) => {
          let wr = res.response
          let params = {}
          parents.push(testData.testWorkRequestParentId)
          params.request_id = testData.testWorkRequestId
          params.parents_i = parents.join()
          params.send_no_email = 'on'
          wrms.work_request.update(params)
            .then((res) => {
              expect(res.success).toBe(true)
            })
        })
      })
    .then(() => {
      // If the test WR already has that parent, remove it.
      return wrms.work_request.get(testData.testWorkRequestId)
        .then(res => {
          let wr = res.response
          expect(typeof wr.parents_by_type.I).toBe('object')
          expect(wr.parents_by_type.I).toEqual(expect.arrayContaining([testData.testWorkRequestParentId]))
        })
    })
    .then(() => {
      done()
    })
})
