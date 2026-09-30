# 10 - Embed tokens: expiry and refresh

Embed tokens expire (about an hour at most). Leave a report open and it stops working
the next time it needs data. The fix: ask your server for a new token a couple of
minutes before `expiration` and apply it with `report.setAccessToken()`. No reload,
filters and slicers stay where they were.

`TOKEN_LIFETIME_MINUTES=5` in `.env` makes the tokens short so you can watch it happen.

```bash
npm run ep10
# http://localhost:3000?refresh=off   report breaks after 5 minutes
# http://localhost:3000               token refreshed at ~3 minutes, keeps working
```

## Walkthrough

1. `server.js`: `lifetimeInMinutes` on GenerateToken.
2. Open with `?refresh=off`, set a slicer, wait for the clock to hit zero, click: error.
3. `public/index.html`: `scheduleRefresh()` and `refreshToken()`.
4. Open without the flag, set a slicer, watch the console log the refresh, slicer unchanged.
5. The `visibilitychange` handler covers laptops that slept past the timer.

Refresh a few minutes early, never on the error.
