const WRMS = require('./wrms')
const testConfig = require('./config-test')
const testData = testConfig.data
const wrms = new WRMS(testConfig.creds)

test('WRMS is a function', () => {
  expect(typeof wrms).toBe('object')
})

test('WRMS.login is a function', () => {
  expect(typeof wrms.login).toBe('function')
})
