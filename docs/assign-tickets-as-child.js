'use strict'

// Assign a bunch of WRs to a parent WR.

// The link types in WRMS have never seemed meaningful to me, so I generally
// use the default, "I" (for "implemented in").

const WRMS = require('wrms')
const creds = require('../.creds')

const wrms = new WRMS(creds)

let wrs = [
  239607,
  241751,
  258391,
  259297,
  259471,
  260613,
  261544,
  276848,
  285388,
  285422,
  285424,
  285426,
  287301,
  289673,
  290453,
  291939,
  294329,
  294618,
]

for (let id of wrs) {
  wrms.work_request.get(id)
    .then((res) => {
      let wr = res.response
      let parents = [295131]
      if (typeof wr.parents_by_type.I !== 'undefined') {
        if (wr.parents_by_type.I.includes('295131')) return;
        parents = wr.parents_by_type.I
        parents.push(295131)
      }
      let params = {
        request_id: id,
        parents_i: parents.join(),
        send_no_email: 'on'
      }
      wrms.work_request.update(params)
        .then((res) => {
          console.log(id, res.success)
        })
    })
}
