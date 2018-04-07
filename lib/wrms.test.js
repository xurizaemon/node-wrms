const WRMS = require('./wrms');

const creds = {
  url: process.env.WRMS_URL || 'https://wrms.example.org',
  username: process.env.WRMS_USERNAME || 'example',
  password: process.env.WRMS_PASSWORD || 'example'
};

test('WRMS().authenticate is a function', () => {
  expect(typeof WRMS(creds).authenticate).toBe('function');
});

test('WRMS().some_thing is set after init', () => {
  expect(typeof WRMS(creds).some_thing).toBe('string');
});

test('WRMS().auth_cookie is set after init', () => {
  expect(typeof WRMS(creds).auth_cookie).toBe('object');
});

test('WRMS().user.lookup returns a user', done => {
  function callback(data) {
    expect(data).toBe('peanut butter');
    done();
  }
  WRMS(creds).api.user.lookup({email: 'chrisburgess@catalyst.net.nz'}, callback);
});
