require('dotenv').config()
const WRMS = require('./wrms')
const creds = {
  endpoint: process.env.WRMS_URL || 'https://wrms.example.org',
  username: process.env.WRMS_USERNAME || 'example',
  password: process.env.WRMS_PASSWORD || 'example'
};

let wrms = new WRMS(creds);

let testData = {
  testUserMail: process.env.WRMS_TEST_USER_MAIL || 'username@example.org'
}

test('WRMS is a function', () => {
  expect(typeof wrms).toBe('object');
});

test('WRMS.login is a function', () => {
  expect(typeof wrms.login).toBe('function');
});

test('Login sets a cookie', done => {
  wrms.login()
    .then(function(res) {
      expect(typeof wrms.wrms3_auth_cookie).toBe('string');
      expect(typeof wrms.headers.Cookie).toBe('string');
      done();
    });
});

test(`User lookup returns a user [${testData.testUserMail}]`, done => {
  const params = {
    field: 'email',
    key: testData.testUserMail
  };
  wrms.user.lookup(params)
    .then((res) => {
      expect(typeof res.response.users).toBe('object');
      expect(res.response.users.length).toBe(1);
      done();
    });
});
