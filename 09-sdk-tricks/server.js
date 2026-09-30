// Five JavaScript SDK tricks. The server is the same as 05; all the tricks are in public/index.html.
import { createApp, json, start } from '../shared/server.js';
import { embedConfig } from '../shared/powerbi.js';

const app = createApp(import.meta.url);
app.get('/api/embed-config', json(() => embedConfig()));
start(app);
