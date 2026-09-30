# 06 - Row-level security (effective identity)

Same flow as 05, plus an `identities` entry on the embed token. Power BI applies the
RLS role to that username before any data leaves the service.

## Report prerequisites

- In Power BI Desktop, Manage roles: a role named `Customer` (or set `RLS_ROLE`) with a
  DAX filter such as `[CustomerKey] = USERNAME()`.
- Rows in the data for `customer-a` and `customer-b` (or change `CUSTOMERS` in `server.js`).
- Test with View as role in Desktop, then publish.

```bash
npm run ep06           # http://localhost:3000, switch "View as"
```

## Walkthrough

1. `server.js`: the `identities` array (username, roles, datasets).
2. Open two browser windows, Customer A and Customer B: same report, different numbers.
3. In a real app the username comes from your own login on the server, never from the browser.
