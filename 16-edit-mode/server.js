// Let customers edit reports and save their own copies.
// The token allows editing (allowEdit) and saving new reports into the workspace (allowSaveAs).
import { createApp, json, start } from '../shared/server.js';
import { embedConfig, listReports, env } from '../shared/powerbi.js';

const CUSTOMERS = ['customer-a', 'customer-b'];
const ROLE = env('RLS_ROLE', 'Customer');

const app = createApp(import.meta.url);

// ?reportId=... to open a saved copy, ?customer=customer-a to apply RLS
app.get('/api/embed-config', json((req) => {
  const { reportId, customer } = req.query;
  if (customer && !CUSTOMERS.includes(customer)) throw new Error('Unknown customer');
  return embedConfig({
    reportId: reportId || undefined,
    allowEdit: true,
    allowSaveAs: true,
    identity: customer ? { username: customer, roles: [ROLE] } : undefined,
  });
}));

app.get('/api/reports', json(async () =>
  (await listReports()).map((r) => ({ id: r.id, name: r.name }))));

start(app);
