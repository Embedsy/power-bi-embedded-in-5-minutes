# 06 - Row-level security (effective identity)

Same flow as 05, plus an `identities` entry on the embed token. Power BI applies the
RLS role to that username before any data leaves the service.

## Report prerequisites

- A role named `Region` in the semantic model, with a DAX filter such as
  `[SalesRepEmail] = USERPRINCIPALNAME()`.
- Rows in the data for `alice@contoso.com` and `bob@contoso.com` (or change `USERS` in `server.js`).

```bash
npm run ep06           # http://localhost:3000, switch "View as"
```

## Walkthrough

1. `server.js`: the `identities` array (username, roles, datasets).
2. Switch Alice / Bob: same report, different rows.
3. In a real app the user comes from your own login on the server, never from the browser.
