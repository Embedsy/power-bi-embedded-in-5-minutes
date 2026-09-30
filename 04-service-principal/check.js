// Quick test for a new service principal: sign in, list the workspaces it can see,
// then the reports in WORKSPACE_ID. Run: npm run ep04
import { getAccessToken, pbi } from '../shared/powerbi.js';

const token = await getAccessToken();
console.log(`Signed in. Access token starts with ${token.slice(0, 12)}...`);

const { value: workspaces } = await pbi('/groups');
if (!workspaces.length) {
  console.log('\nNo workspaces visible. Add the app to a workspace as Member or Admin,');
  console.log('and check the tenant setting that lets service principals use the APIs.');
  process.exit(1);
}

console.log('\nWorkspaces:');
for (const w of workspaces) {
  console.log(`  ${w.name}  ${w.id}  ${w.isOnDedicatedCapacity ? 'on capacity' : 'NOT on a capacity'}`);
}

const workspaceId = process.env.WORKSPACE_ID;
if (workspaceId && !workspaceId.startsWith('00000000')) {
  const { value: reports } = await pbi(`/groups/${workspaceId}/reports`);
  console.log(`\nReports in ${workspaceId}:`);
  for (const r of reports) console.log(`  ${r.name}  ${r.id}`);
}
