# Understanding

* Schema diagram: https://wiki.wgtn.cat-it.co.nz/w/images/4/4a/Wrms-schema-201805.png
* POST methods in api2: https://gitlab.wgtn.cat-it.co.nz/search?utf8=%E2%9C%93&snippets=&scope=&search=%40app.post%28%27%2Fapi2%2F&project_id=295
* GET methods in api2: https://gitlab.wgtn.cat-it.co.nz/search?utf8=%E2%9C%93&snippets=&scope=&search=%40app.get%28%27%2Fapi2%2F&project_id=295
* https://wrms2-uat.wgtn.cat-it.co.nz/api2/routes lists available routes (in v2 API)

# Wishlist

I'd like it if WRMS showed proposed statuses in sane order (eg Pending QA comes before QA Approved)

## Entities

### Timesheets (v1 API)

* https://gitlab.wgtn.cat-it.co.nz/WRMS/wrms2/blob/master/inc/api/timesheets.php
* All API v1 timesheet methods use `$session->user_no` ie they work only for the currently logged-in user. This means the API can't be used for requests like:
```
<george> hello, which one of you folk is able to run SQL queries to shuffle some timesheet entries to another WR?
<aldenfairley> george: I don't recall any cases of this being done in the past
<aldenfairley> is this for your own time?
<george> no, it's a few people
<xurizaemon> TKS makes it very easy for a single person to do it themself, but even via API i think the timesheet endpoint assumes it's *your* timesheet
<xurizaemon> (based on my limited exploration anyway)
<george> yes, as I understand it a SQL query of sorts is the fastest and least painful way of doing it
<george> without pestering four people to shuffle manually
```
* https://gitlab.wgtn.cat-it.co.nz/WRMS/wrms3/blob/master/wrms/pages/api2_timesheet_update.py
* It looks like /api2/timesheet_update might let you do this? If you got the timesheet entries from a report and changed them via that method?
