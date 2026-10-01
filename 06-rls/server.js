// Row-level security with an effective identity.
// Same flow as 05, on the RLS version of the sample report. The embed token carries a username + role,
// so the semantic model filters rows before anything reaches the browser.
import express from 'express';
import { fileURLToPath } from 'node:url';
import { config, env, getReport, generateEmbedToken } from '../shared/powerbi.js';

// Demo customers. In a real app this comes from your own login, never from the browser.
const CUSTOMERS = ['customer-a', 'customer-b'];
const ROLE = env('RLS_ROLE', 'Customer');

const app = express();
app.use(express.static(fileURLToPath(new URL('./public', import.meta.url))));

app.get('/api/embed-config', async (req, res) => {
  const username = req.query.customer;
  if (!CUSTOMERS.includes(username)) return res.status(400).json({ error: 'Unknown customer' });
  try {
    const report = await getReport(config.rlsReportId);
    const token = await generateEmbedToken({
      reports: [report],
      identities: [{ username, roles: [ROLE], datasets: [report.datasetId] }],
    });
    res.json({
      reportId: report.id,
      embedUrl: report.embedUrl,
      accessToken: token.token,
      viewingAs: username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(config.port, () => console.log(`Running on http://localhost:${config.port}`));
