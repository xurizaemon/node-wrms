/* eslint no-process-env: off */
const WRMS = require("./wrms");
const testConfig = require("./config-test");
const wrms = new WRMS(testConfig.creds);

test("WRMS is a function", () => {
  expect(typeof wrms).toBe("object");
});

test("WRMS.login is a function", () => {
  expect(typeof wrms.login).toBe("function");
});

// @TODO: Permit setting WRMS_SSL_INSECURE to false-y values.
test("WRMS.defaultRequestOptions detects WRMS_SSL_INSECURE when set", () => {
  const prev_ssl_insecure =
    typeof process.env.WRMS_SSL_INSECURE !== "undefined" || undefined;

  process.env.WRMS_SSL_INSECURE = 1;
  expect(wrms.defaultRequestOptions().insecure).toBe(true);
  expect(wrms.defaultRequestOptions().rejectUnauthorized).toBe(false);

  process.env.WRMS_SSL_INSECURE = "1";
  expect(wrms.defaultRequestOptions().insecure).toBe(true);
  expect(wrms.defaultRequestOptions().rejectUnauthorized).toBe(false);

  process.env.WRMS_SSL_INSECURE = "true";
  expect(wrms.defaultRequestOptions().insecure).toBe(true);
  expect(wrms.defaultRequestOptions().rejectUnauthorized).toBe(false);

  process.env.WRMS_SSL_INSECURE = "unexpected";
  expect(wrms.defaultRequestOptions().insecure).toBe(true);
  expect(wrms.defaultRequestOptions().rejectUnauthorized).toBe(false);

  // Process.env.WRMS_SSL_INSECURE = undefined
  // expect(wrms.defaultRequestOptions().insecure).toBe(false)
  // expect(wrms.defaultRequestOptions().rejectUnauthorized).toBe(true)

  // process.env.WRMS_SSL_INSECURE = 0
  // expect(wrms.defaultRequestOptions().insecure).toBe(false)
  // expect(wrms.defaultRequestOptions().rejectUnauthorized).toBe(true)
  //
  // process.env.WRMS_SSL_INSECURE = '0'
  // expect(wrms.defaultRequestOptions().insecure).toBe(false)
  // expect(wrms.defaultRequestOptions().rejectUnauthorized).toBe(true)
  //
  // process.env.WRMS_SSL_INSECURE = 'false'
  // expect(wrms.defaultRequestOptions().insecure).toBe(false)
  // expect(wrms.defaultRequestOptions().rejectUnauthorized).toBe(true)

  process.env.WRMS_SSL_INSECURE = prev_ssl_insecure;
});
