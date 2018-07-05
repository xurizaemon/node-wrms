require('dotenv').config()

const WRMS = require('./wrms')

const creds = {
  endpoint: process.env.WRMS_URL || 'https://wrms.example.org',
  username: process.env.WRMS_USERNAME || 'example',
  password: process.env.WRMS_PASSWORD || 'example'
}

const wrms = new WRMS(creds)

const testData = {
  testUserMail: process.env.WRMS_TEST_USER_MAIL || 'username@example.org',
  testWorkRequestSearchTerm: process.env.WRMS_TEST_WR_SEARCH_TERM || 'hapax legomenon',
  testWorkRequestId: process.env.WRMS_TEST_WR_ID || 123,
  testWorkRequestParentId: process.env.WRMS_TEST_PARENT_ID || 321,
  testWorkRequestSubject: process.env.WRMS_TEST_WR_SUBJECT || 'testing'
}

// Ensure a ticket has a parent.
test(`Work request [${testData.testWorkRequestId}] has parent [${testData.testWorkRequestParentId}]`, done => {
  wrms.work_request.get(testData.testWorkRequestId)
    .then((res) => {
      let parents = []
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
            wrms.work_request.update(params)
              .then((res) => {
                expect(res.success).toBe(true)
                done()
              })
            
      }
      // If the test WR already has that parent, remove it.
      wrms.work_request.get(testData.testWorkRequestId)
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
              done()
            })
        })
//
    })
})
