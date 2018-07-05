const WRMS = require('./wrms')
const testConfig = require('./config-test')
const testData = testConfig.data
const wrms = new WRMS(testConfig.creds)

test('Login sets a cookie', done => {
  wrms.login()
    .then(function(res) {
      expect(typeof wrms.wrms3_auth_cookie).toBe('string')
      expect(typeof wrms.headers.Cookie).toBe('string')
      done()
    })
})
