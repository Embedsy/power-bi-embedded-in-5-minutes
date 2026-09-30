// Embed tokens expire. This server hands out short-lived tokens (TOKEN_LIFETIME_MINUTES)
// so you can watch the refresh happen; the fix itself is in public/index.html.
import { createApp, json, start } from '../shared/server.js';
import { embedConfig } from '../shared/powerbi.js';

const lifetimeInMinutes = Number(process.env.TOKEN_LIFETIME_MINUTES) || undefined;

const app = createApp(import.meta.url);
app.get('/api/embed-config', json(() => embedConfig({ lifetimeInMinutes })));
start(app);
