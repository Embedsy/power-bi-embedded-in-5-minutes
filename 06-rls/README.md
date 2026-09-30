# 06 - Row-level security (effective identity)

Same flow as 05, plus an `identities` entry on the embed token. Power BI applies the
RLS role to that username before any data leaves the service.

## Report

The sample report in `powerbi/` already has the role: `Customer`, with
`[CustomerKey] = USERNAME()` on the Customers table. To build it yourself in
Power BI Desktop: Modeling > Manage roles, add the role and filter, test with
View as, publish.

```bash
npm run ep06           # http://localhost:3000, switch "View as"
```

## Walkthrough

1. `server.js`: the `identities` array (username, roles, datasets).
2. Open two browser windows, Customer A and Customer B: same report, different numbers.
3. In a real app the username comes from your own login on the server, never from the browser.
