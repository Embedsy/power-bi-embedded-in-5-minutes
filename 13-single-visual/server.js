// Embed single visuals. One embed token covers the report and every visual in it;
// the difference is all in the embed config in public/index.html.
import { createApp, json, start } from '../shared/server.js';
import { embedConfig } from '../shared/powerbi.js';

const app = createApp(import.meta.url);
app.get('/api/embed-config', json(() => embedConfig()));
start(app);
