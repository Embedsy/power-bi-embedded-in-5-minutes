# 05 - Your first embedded report in under 50 lines

App owns data: the server signs in as a service principal and gets an embed token, and
the page embeds the report with `powerbi-client`. The client secret never reaches the
browser. `server.js` (35 lines) plus the script in `public/index.html` (14 lines) is all
of it; this sample doesn't use `shared/`.

```bash
npm install
cp .env.example .env   # fill in your IDs and secret
npm run ep05           # http://localhost:3000
```

## Walkthrough

1. `server.js`: MSAL client credentials > Get Report In Group (embed URL, dataset ID) > GenerateToken.
2. `public/index.html`: `powerbi.embed()` with `TokenType.Embed`.
3. DevTools > Network: the page gets an embed token, never the Entra ID token.

The sample report has row-level security, so the token carries the `DEFAULT_ROLE` identity.
Leave `DEFAULT_ROLE` empty for a report without RLS.
