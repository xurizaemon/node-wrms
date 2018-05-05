require('dotenv').config()

const WRMS = require('wrms')

const creds = {
  endpoint: process.env.WRMS_URL || 'https://wrms.example.org',
  username: process.env.WRMS_USERNAME || 'example',
  password: process.env.WRMS_PASSWORD || 'example'
}

const wrms = new WRMS(creds)

const testData = {
  testUserMail: process.env.WRMS_TEST_USER_MAIL || 'username@example.org',
  testWorkRequestSearchTerm: process.env.WRMS_TEST_WR_SEARCH_TERM || 'hapax legomenon',
  testWorkRequestId: process.env.WRMS_TEST_WR_ID || 123
}

test('WRMS is a function', () => {
  expect(typeof wrms).toBe('object')
})

test('WRMS.login is a function', () => {
  expect(typeof wrms.login).toBe('function')
})

test('Login sets a cookie', done => {
  wrms.login()
    .then(function(res) {
      expect(typeof wrms.wrms3_auth_cookie).toBe('string')
      expect(typeof wrms.headers.Cookie).toBe('string')
      done()
    })
})

test(`User lookup returns a user [${testData.testUserMail}]`, done => {
  const params = {
    field: 'email',
    key: testData.testUserMail
  }
  wrms.user.lookup(params)
    .then((res) => {
      expect(typeof res.response.users).toBe('object')
      expect(res.response.users.length).toBe(1)
      done()
    })
})

test(`Work request search results [${testData.testWorkRequestSearchTerm}]`, done => {
  const params = {
    q: testData.testWorkRequestSearchTerm
  }
  wrms.work_request.search(params)
    .then((res) => {
      expect(typeof res.response.body).toBe('object')
      expect(res.response.body.length).toBe(1)
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
