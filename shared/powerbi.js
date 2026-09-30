// Shared helpers used by every sample: service principal sign-in, Power BI REST calls,
// embed tokens and export to file. Each episode folder only adds what's new.
import 'dotenv/config';
import { ConfidentialClientApplication } from '@azure/msal-node';

const API = 'https://api.powerbi.com/v1.0/myorg';

export function env(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    console.error(`Missing ${name} in .env (copy .env.example to .env)`);
    process.exit(1);
  }
  return value;
}

export const config = {
  get workspaceId() { return env('WORKSPACE_ID'); },
  get reportId() { return env('REPORT_ID'); },
  port: Number(process.env.PORT) || 3000,
};

const msal = new ConfidentialClientApplication({
  auth: {
    clientId: env('CLIENT_ID'),
    clientSecret: env('CLIENT_SECRET'),
    authority: `https://login.microsoftonline.com/${env('TENANT_ID')}`,
  },
});

// Entra ID access token (app-only, client credentials) for a given API.
export async function getAccessToken(scope = 'https://analysis.windows.net/powerbi/api/.default') {
  const result = await msal.acquireTokenByClientCredential({ scopes: [scope] });
  return result.accessToken;
}

// Raw call to the Power BI REST API. Returns the fetch Response.
export async function pbiFetch(path, options = {}) {
  const token = await getAccessToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) {
    const body = await res.text();
    const requestId = res.headers.get('requestid') || res.headers.get('x-ms-request-id') || '';
    throw new Error(`${res.status} ${res.statusText} on ${path} ${requestId}\n${body}`);
  }
  return res;
}

export async function pbi(path, options) {
  const res = await pbiFetch(path, options);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Report metadata: id, name, embedUrl and datasetId.
export function getReport(reportId = config.reportId, workspaceId = config.workspaceId) {
  return pbi(`/groups/${workspaceId}/reports/${reportId}`);
}

export async function listReports(workspaceId = config.workspaceId) {
  return (await pbi(`/groups/${workspaceId}/reports`)).value;
}

// A semantic model with RLS always needs an identity when a service principal asks for
// a token. Samples that aren't about RLS use this one (see DEFAULT_ROLE in .env.example).
function defaultIdentities(datasetIds) {
  const role = process.env.DEFAULT_ROLE;
  if (!role) return undefined;
  return [{ username: process.env.DEFAULT_USERNAME || 'demo', roles: [role], datasets: datasetIds }];
}

// Embed token via the multi-resource GenerateToken API.
//   identities        RLS effective identities (see 06-rls)
//   lifetimeInMinutes shorter tokens, handy for testing refresh (see 10-token-refresh)
//   allowEdit         edit mode (see 16-edit-mode)
//   allowSaveAs       lets the user save a copy into the workspace (see 16-edit-mode)
export function generateEmbedToken({
  reports,
  workspaceId = config.workspaceId,
  identities,
  lifetimeInMinutes,
  allowEdit = false,
  allowSaveAs = false,
}) {
  const datasetIds = [...new Set(reports.map((r) => r.datasetId))];
  const body = {
    reports: reports.map((r) => ({ id: r.id, allowEdit })),
    datasets: datasetIds.map((id) => ({ id })),
  };
  if (allowSaveAs) body.targetWorkspaces = [{ id: workspaceId }];
  const effective = identities || defaultIdentities(datasetIds);
  if (effective) body.identities = effective;
  if (lifetimeInMinutes) body.lifetimeInMinutes = lifetimeInMinutes;
  return pbi('/GenerateToken', { method: 'POST', body: JSON.stringify(body) });
}

// Everything the browser needs to embed one report.
// Pass `identity: { username, roles }` for an RLS semantic model.
export async function embedConfig({ identity, ...options } = {}) {
  const report = await getReport(options.reportId);
  const identities = identity ? [{ ...identity, datasets: [report.datasetId] }] : undefined;
  const token = await generateEmbedToken({ ...options, identities, reports: [report] });
  return {
    reportId: report.id,
    reportName: report.name,
    embedUrl: report.embedUrl,
    accessToken: token.token,
    expiration: token.expiration,
  };
}

// Export To File: start the job, poll until done, return the file.
//   format   PDF, PPTX or PNG
//   state    bookmark state captured in the browser (report.bookmarksManager.capture())
//   identity { username, roles } to export an RLS semantic model as one user
export async function exportReport({
  format = 'PDF',
  state,
  identity,
  reportId = config.reportId,
  workspaceId = config.workspaceId,
  pollSeconds = 5,
}) {
  const base = `/groups/${workspaceId}/reports/${reportId}`;
  const body = { format, powerBIReportConfiguration: {} };
  if (state) body.powerBIReportConfiguration.defaultBookmark = { state };
  const { datasetId } = await getReport(reportId, workspaceId);
  const identities = identity ? [{ ...identity, datasets: [datasetId] }] : defaultIdentities([datasetId]);
  if (identities) body.powerBIReportConfiguration.identities = identities;

  let job = await pbi(`${base}/ExportTo`, { method: 'POST', body: JSON.stringify(body) });
  while (job.status === 'NotStarted' || job.status === 'Running') {
    await new Promise((r) => setTimeout(r, pollSeconds * 1000));
    job = await pbi(`${base}/exports/${job.id}`);
    console.log(`Export ${job.status} ${job.percentComplete}%`);
  }
  if (job.status !== 'Succeeded') throw new Error(`Export ${job.status}: ${JSON.stringify(job.error || {})}`);

  const file = await pbiFetch(`${base}/exports/${job.id}/file`);
  return {
    buffer: Buffer.from(await file.arrayBuffer()),
    extension: job.resourceFileExtension || `.${format.toLowerCase()}`,
    fileName: `${job.reportName || 'report'}${job.resourceFileExtension || ''}`,
  };
}
