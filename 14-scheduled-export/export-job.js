// The do-it-yourself version of scheduled report emails: export one PDF per customer,
// each filtered by RLS, and save it. Run it on a timer (cron, an Azure Functions timer
// trigger, a Logic App) and send the files with Microsoft Graph sendMail.
// Usage: npm run ep14
import { mkdir, writeFile } from 'node:fs/promises';
import { env, exportReport } from '../shared/powerbi.js';

// Who gets which data. In a real system this is a table, not a constant.
const RECIPIENTS = [
  { email: 'a@example.com', username: 'customer-a' },
  { email: 'b@example.com', username: 'customer-b' },
];
const ROLE = env('RLS_ROLE', 'Customer');
const outDir = new URL('./out/', import.meta.url);

await mkdir(outDir, { recursive: true });

for (const recipient of RECIPIENTS) {
  console.log(`Exporting for ${recipient.username}...`);
  const file = await exportReport({
    format: 'PDF',
    identity: { username: recipient.username, roles: [ROLE] },
  });
  const path = new URL(`${recipient.username}${file.extension}`, outDir);
  await writeFile(path, file.buffer);
  console.log(`  saved ${path.pathname} (would email to ${recipient.email})`);
}
