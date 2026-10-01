# 16 - Let customers build their own reports

Two changes turn a read-only embed into an editor:

- **Token** (`server.js`): `allowEdit: true` on the report, and the workspace in
  `targetWorkspaces` (`allowSaveAs`) so Save As can create a new report there.
- **Embed config** (`public/index.html`): `permissions: models.Permissions.All` and
  `viewMode: models.ViewMode.Edit`.

It uses `RLS_REPORT_ID`, the RLS version of the sample report, so copies saved by a
customer stay filtered to that customer. Without `?customer=` you edit as an admin
with the `All Customers` role.

```bash
npm run ep16
# http://localhost:3000?customer=customer-a   same, with RLS applied
```

## Walkthrough

1. The report opens in edit mode with the full authoring experience.
2. Add a visual, File > Save As, give it a name.
3. The new report appears in the sidebar. Click it: it loads, and with `?customer=`
   it is still filtered by RLS.

## Things to decide before shipping this

- Saved copies land in the workspace the token names. Give each customer their own
  workspace, or customers can open each other's reports.
- The service principal owns everything saved this way; track who created what yourself.
- Authoring renders on your capacity like any other report load.
