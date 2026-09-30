# 05 - Your first embedded report

App owns data: a service principal gets an embed token on the server, and the page
embeds the report with `powerbi-client`. The client secret never reaches the browser.

```bash
npm install
cp .env.example .env   # fill in your IDs and secret
npm run ep05           # http://localhost:3000
```

## Walkthrough

1. `shared/powerbi.js`: `getAccessToken()` > `getReport()` > `generateEmbedToken()`.
2. `server.js`: one route, `/api/embed-config`.
3. `public/index.html`: `powerbi.embed()` with `TokenType.Embed`.
4. DevTools > Network: the page gets an embed token, never the Entra ID token.
