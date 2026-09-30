# Power BI Embedded in 5 Minutes: sample code

Sample code for the video series. Each folder matches one video and runs on its own;
the shared plumbing (sign-in, embed tokens, export) lives in `shared/`.

| Folder | Video | Run |
|---|---|---|
| `04-service-principal` | Set up a service principal | `npm run ep04` |
| `05-first-embed` | Your first embedded report in under 50 lines | `npm run ep05` |
| `06-rls` | Row-level security for embedded reports | `npm run ep06` |
| `08-capacity` | Capacity and cost: pause and resume from code | `npm run ep08 -- status` |
| `09-sdk-tricks` | 5 JavaScript SDK tricks | `npm run ep09` |
| `10-token-refresh` | Embed tokens: expiry and refresh | `npm run ep10` |
| `11-export` | Export embedded reports to PDF and PowerPoint | `npm run ep11` |
| `13-single-visual` | Embed a single visual | `npm run ep13` |
| `14-scheduled-export` | Schedule report emails | `npm run ep14` |
| `16-edit-mode` | Let customers build their own reports | `npm run ep16` |

The other videos in the series are concepts and portal walkthroughs with no code.

## Setup

1. Node.js 18 or later.
2. A service principal with access to a workspace on a capacity. `04-service-principal`
   has the checklist and a script to test it.
3. The sample report from `powerbi/` published to that workspace.
4. `cp .env.example .env` and fill it in. `.env` is git-ignored. Never commit secrets.

```bash
npm install
npm run ep04   # check the setup
npm run ep05   # http://localhost:3000
```

## Sample report

`powerbi/Embedded Sample.pbip` is the report used in the videos: customers, products
and monthly sales, with an RLS role `Customer` for `customer-a` to `customer-f`.
No data source to connect. Open it in Power BI Desktop, refresh and publish.
See `powerbi/README.md`.

## Shared code

- `shared/powerbi.js`: `getAccessToken()`, `getReport()`, `generateEmbedToken()`,
  `embedConfig()`, `exportReport()`
- `shared/server.js`: a few lines of Express setup used by the later samples

---
The production version of all of this (branding, roles, scheduling, writeback, capacity
automation) is [Embedsy](https://embedsy.io).
