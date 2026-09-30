// Shared helpers: Entra ID token for a service principal, report lookup, embed token.
// Used by every episode folder so each demo only shows what's new.
import 'dotenv/config';
import { ConfidentialClientApplication } from '@azure/msal-node';

const API = 'https://api.powerbi.com/v1.0/myorg';

const required = ['TENANT_ID', 'CLIENT_ID', 'CLIENT_SECRET', 'WORKSPACE_ID', 'REPORT_ID'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing in .env: ${missing.join(', ')} (copy .env.example to .env)`);
  process.exit(1);
}

export const config = {
  workspaceId: process.env.WORKSPACE_ID,
  reportId: process.env.REPORT_ID,
  port: Number(process.env.PORT) || 3000,
};

const msal = new ConfidentialClientApplication({
  auth: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
  },
});

// 1. Entra ID access token for the Power BI REST API (app-only, client credentials).
export async function getAccessToken() {
  const result = await msal.acquireTokenByClientCredential({
    scopes: ['https://analysis.windows.net/powerbi/api/.default'],
  });
  return result.accessToken;
}

async function pbi(path, options = {}) {
  const token = await getAccessToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText} on ${path}: ${body}`);
  }
  return res.json();
}

// 2. Report metadata: embedUrl and the semantic model (dataset) behind it.
export function getReport(workspaceId = config.workspaceId, reportId = config.reportId) {
  return pbi(`/groups/${workspaceId}/reports/${reportId}`);
}

// 3. Embed token (multi-resource GenerateToken API).
//    Pass `identities` to apply row-level security (see 06-rls).
export function generateEmbedToken({ report, workspaceId = config.workspaceId, identities }) {
  const body = {
    reports: [{ id: report.id }],
    datasets: [{ id: report.datasetId }],
    targetWorkspaces: [{ id: workspaceId }],
  };
  if (identities) body.identities = identities;
  return pbi('/GenerateToken', { method: 'POST', body: JSON.stringify(body) });
}
