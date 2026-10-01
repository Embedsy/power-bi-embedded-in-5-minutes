// Let customers edit reports and save their own copies.
// The token allows editing (allowEdit) and saving new reports into the workspace (allowSaveAs).
import { createApp, json, start } from '../shared/server.js';
import { config, embedConfig, listReports, env } from '../shared/powerbi.js';

const CUSTOMERS = ['customer-a', 'customer-b'];
const ROLE = env('RLS_ROLE', 'Customer');

const app = createApp(import.meta.url);

// Uses the RLS version of the sample report, so saved copies keep RLS too.
// ?reportId=... to open a saved copy, ?customer=customer-a to edit as that customer.
// Without ?customer you edit as an admin who sees every customer.
app.get('/api/embed-config', json((req) => {
  const { reportId, customer } = req.query;
  if (customer && !CUSTOMERS.includes(customer)) throw new Error('Unknown customer');
  return embedConfig({
    reportId: reportId || config.rlsReportId,
    allowEdit: true,
    allowSaveAs: true,
    identity: customer ? { username: customer, roles: [ROLE] } : { username: 'admin', roles: ['All Customers'] },
  });
}));

app.get('/api/reports', json(async () =>
  (await listReports()).map((r) => ({ id: r.id, name: r.name }))));

start(app);
