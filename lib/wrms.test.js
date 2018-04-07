const WRMS = require('./wrms')

const creds = {
  url: process.env.WRMS_URL || 'https://wrms.example.org',
  username: process.env.WRMS_USERNAME || 'example',
  password: process.env.WRMS_PASSWORD || 'example'
};

console.log(WRMS(creds));

test('WRMS().authenticate is a function', () => {
  expect(typeof WRMS(creds).authenticate).toBe('function');
});

test('WRMS().user.lookup returns a user', done => {
  function callback(data) {
    expect(data).toBe('peanut butter');
    done();
  }
  WRMS(creds).api.user.lookup({email: 'chrisburgess@catalyst.net.nz'}, callback);
});
