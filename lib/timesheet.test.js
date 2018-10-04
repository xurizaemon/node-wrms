const WRMS = require('./wrms')
const testConfig = require('./config-test')
const testData = testConfig.data
const wrms = new WRMS(testConfig.creds)

// Timesheets (WRMSv2 API).
if (typeof process.env.WRMS_EXTRA_COOKIES !== 'undefined') {
  test(`Timesheet has recent entries [v2 API]`, done => {
    wrms.timesheet.recent()
      .then((res) => {
        expect(typeof res.response).toBe('object')
        done()
      })
  })
}
else {
  xtest(`Timesheet has recent entries [v2 API]`, done => {
    wrms.timesheet.recent()
      .then((res) => {
        expect(typeof res.response).toBe('object')
        done()
      })
  })
}
