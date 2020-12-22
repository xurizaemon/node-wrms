require("dotenv").config();

const creds = {
  endpoint: process.env.WRMS_URL || "https://wrms.example.org",
  username: process.env.WRMS_USERNAME || "example",
  password: process.env.WRMS_PASSWORD || "example"
};

const data = {
  testUserMail: process.env.WRMS_TEST_USER_MAIL || "username@example.org",
  testWorkRequestSearchTerm:
    process.env.WRMS_TEST_WR_SEARCH_TERM || "hapax legomenon",
  testWorkRequestSystem: process.env.WRMS_TEST_WR_SYSTEM || 18,
  testWorkRequestId: process.env.WRMS_TEST_WR_ID || 123,
  testWorkRequestParentId: process.env.WRMS_TEST_PARENT_ID || 321,
  testWorkRequestSubject: process.env.WRMS_TEST_WR_SUBJECT || "testing"
};

// Const WRMS = require('./wrms')
// const wrms = new WRMS(creds)

module.exports = {
  // Wrms: wrms,
  creds: creds,
  data: data
};
