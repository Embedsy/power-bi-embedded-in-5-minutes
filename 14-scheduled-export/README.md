# 14 - Schedule report emails (the do-it-yourself way)

`export-job.js` exports one PDF per recipient, each filtered by RLS, using the same
`exportReport()` as 11. This is the core of a scheduled email; the rest is plumbing:

```
timer (cron / Functions / Logic App)
  > for each recipient: Export To File with their RLS identity
  > poll until done, download
  > send with Microsoft Graph (POST /users/{sender}/sendMail, file as attachment)
  > log the result, retry failures, alert when a schedule keeps failing
```

```bash
npm run ep14           # PDFs land in 14-scheduled-export/out/
```

## Requirements

- Same as 11, plus the RLS version of the sample report (`RLS_REPORT_ID`) and its role
  (`RLS_ROLE`, default `Customer`).
- Exporting with an RLS identity needs the service principal to be Contributor or Admin
  on the workspace and have write permission on the semantic model.
- Sending mail with Graph needs the `Mail.Send` application permission, ideally limited
  to one mailbox with an application access policy.
