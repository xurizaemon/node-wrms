/* eslint no-process-env: off */
const WRMS = require("./wrms");
const testConfig = require("./config-test");
const wrms = new WRMS(testConfig.creds);

test("WRMS() is a function", () => {
  expect(typeof wrms).toBe("object");
});

// Ensure API functions exist.
const wrmsApiMethods = {
  login: wrms.login,
  notifications_get: wrms.notifications.get,
  notifications_mark: wrms.notifications.mark,
  organisation_create: wrms.organisation.create,
  organisation_update: wrms.organisation.update,
  organisation_system_update: wrms.organisation.system.update,
  report_saved: wrms.report.saved,
  report_get: wrms.report.get,
  report_configuration: wrms.report.configuration,
  system_create: wrms.system.create,
  system_update: wrms.system.update,
  timesheet_recent: wrms.timesheet.recent,
  timesheet_record: wrms.timesheet.record,
  timesheet_update: wrms.timesheet.update,
  user_lookup: wrms.user.lookup,
  user_create: wrms.user.create,
  user_roles_update: wrms.user.roles.update,
  user_system_roles_update: wrms.user.system_roles.update,
  work_request_search: wrms.work_request.search,
  work_request_get: wrms.work_request.get,
  work_request_update: wrms.work_request.update,
  work_request_add_tags: wrms.work_request.add_tags,
  work_request_remove_tags: wrms.work_request.remove_tags,
  work_request_subscribe: wrms.work_request.subscribe,
  work_request_unsubscribe: wrms.work_request.unsubscribe,
  work_request_allocate: wrms.work_request.allocate,
  work_request_deallocate: wrms.work_request.deallocate
};
Object.keys(wrmsApiMethods).forEach(f => {
  test(`${f.replace(/_/g, ".")} is a function`, () => {
    expect(typeof wrmsApiMethods[f]).toBe("function");
  });
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
