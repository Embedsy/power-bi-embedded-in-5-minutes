// Pause, resume or check a Fabric capacity through Azure Resource Manager.
// Usage: npm run ep08 -- status | pause | resume
// Schedule "pause" in the evening and "resume" in the morning (cron, Azure Automation,
// a Logic App or a timer-triggered Function) and you stop paying for idle hours.
import { env, getAccessToken } from '../shared/powerbi.js';

const API_VERSION = '2023-11-01';
const capacityUrl =
  `https://management.azure.com/subscriptions/${env('SUBSCRIPTION_ID')}` +
  `/resourceGroups/${env('RESOURCE_GROUP')}` +
  `/providers/Microsoft.Fabric/capacities/${env('CAPACITY_NAME')}`;

async function arm(method, path = '') {
  const token = await getAccessToken('https://management.azure.com/.default');
  const res = await fetch(`${capacityUrl}${path}?api-version=${API_VERSION}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}\n${await res.text()}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function status() {
  const capacity = await arm('GET');
  return { name: capacity.name, sku: capacity.sku.name, state: capacity.properties.state };
}

async function waitFor(target) {
  for (let i = 0; i < 60; i++) {
    const s = await status();
    console.log(`  ${s.state}`);
    if (s.state === target) return s;
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(`Still not ${target} after 5 minutes`);
}

const action = process.argv[2] || 'status';

if (action === 'status') {
  console.log(await status());
} else if (action === 'pause') {
  await arm('POST', '/suspend');
  console.log('Pausing...');
  await waitFor('Paused');
} else if (action === 'resume') {
  await arm('POST', '/resume');
  console.log('Resuming...');
  await waitFor('Active');
} else {
  console.error('Use: status | pause | resume');
  process.exit(1);
}
