const WRMS = require('./wrms')
const testConfig = require('./config-test')
const testData = testConfig.data
const wrms = new WRMS(testConfig.creds)

test(`Work request search results [${testData.testWorkRequestSearchTerm}]`, done => {
  const params = {
    q: testData.testWorkRequestSearchTerm
  }
  wrms.work_request.search(params)
    .then((res) => {
      expect(typeof res.response.body).toBe('object')
      expect(res.response.body.length).toBeGreaterThan(0)
      done()
    })
})

test(`Work request get [${testData.testWorkRequestId}]`, done => {
  wrms.work_request.get(testData.testWorkRequestId)
    .then((res) => {
      expect(typeof res.response.detailed).toBe('string')
      done()
    })
})

// Ensure we can get a WR subject.
test(`Work request [${testData.testWorkRequestId}] has subject ["${testData.testWorkRequestSubject}"]`, done => {
  wrms.work_request.get(testData.testWorkRequestId)
    .then((res) => {
      expect(res.response.brief).toBe(testData.testWorkRequestSubject)
      done()
    })
})
