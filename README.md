# Power BI Embedded in 5 Minutes: sample code

Demo code for the YouTube series. Each folder matches one video and runs on its own;
shared plumbing (auth, report lookup, embed token) lives in `shared/powerbi.js`.

| Folder | Video | Run |
|---|---|---|
| `05-first-embed` | Your first embedded report (app owns data) | `npm run ep05` |
| `06-rls` | Row-level security with an effective identity | `npm run ep06` |

More folders are added as episodes are recorded.

## Setup

1. Node.js 18 or later.
2. An Entra ID app registration with a client secret, added as Member or Admin of the workspace.
3. In the Fabric admin portal, allow service principals to use Fabric/Power BI APIs.
4. The workspace on a capacity (F, A or P SKU; a trial works for testing).
5. `cp .env.example .env` and fill it in. `.env` is git-ignored Never commit secrets.

```bash
npm install
npm run ep05
```

## Sample report

The demos expect one report with a semantic model that has a `Region` RLS role
(see `06-rls/README.md`). Any report works for 05.

---
The production version of all of this (branding, roles, scheduling, writeback, capacity
automation) is [Embedsy](https://embedsy.io).
