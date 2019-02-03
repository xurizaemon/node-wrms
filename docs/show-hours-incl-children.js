"use strict";

// Given that some tickets are child tickets (via "I") of a parent WR,
// find them and print their hours.
// WRMS should do this in the UI ...

const WRMS = require("wrms");
const creds = require("../.creds");
const wrms = new WRMS(creds);

let parent_id = 295131;

wrms.work_request.get(parent_id).then(res => {
  let parent_wr = res.response;
  console.log(`* WR#${parent_id} - ${parent_wr.hours.toFixed(2)}H (parent)`);
  if (typeof parent_wr.children_by_type.I !== "object") {
    console.log("No child requests found.");
  } else {
    for (let child_id of parent_wr.children_by_type.I) {
      wrms.work_request.get(child_id).then(res => {
        let child_wr = res.response;
        console.log(`* WR#${child_id} - ${child_wr.hours.toFixed(2)}H`);
      });
    }
  }
});
