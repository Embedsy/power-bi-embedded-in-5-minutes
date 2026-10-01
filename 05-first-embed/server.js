// Your first embedded report (app owns data). The whole backend is this one file.
// The browser never sees the client secret: it asks this server for an embed token.
import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { ConfidentialClientApplication } from '@azure/msal-node';

const { TENANT_ID, CLIENT_ID, CLIENT_SECRET, WORKSPACE_ID, REPORT_ID, PORT = 3000 } = process.env;

const msal = new ConfidentialClientApplication({
  auth: { clientId: CLIENT_ID, clientSecret: CLIENT_SECRET, authority: `https://login.microsoftonline.com/${TENANT_ID}` },
});

async function powerBI(path, body) {
  // 1. Entra ID token for the service principal (client credentials)
  const { accessToken } = await msal.acquireTokenByClientCredential({ scopes: ['https://analysis.windows.net/powerbi/api/.default'] });
  const res = await fetch(`https://api.powerbi.com/v1.0/myorg${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} on ${path}: ${await res.text()}`);
  return res.json();
}

const app = express();
app.use(express.static(fileURLToPath(new URL('./public', import.meta.url))));

app.get('/api/embed-config', async (_req, res) => {
  try {
    // 2. The report: embed URL and the semantic model behind it
    const report = await powerBI(`/groups/${WORKSPACE_ID}/reports/${REPORT_ID}`);
    // 3. An embed token for the report and its semantic model
    const token = await powerBI('/GenerateToken', {
      reports: [{ id: report.id }],
      datasets: [{ id: report.datasetId }],
    });
    res.json({ reportId: report.id, embedUrl: report.embedUrl, accessToken: token.token, expiration: token.expiration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
