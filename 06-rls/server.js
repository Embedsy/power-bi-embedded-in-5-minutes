// Episode: Row-level security with an effective identity.
// Same flow as 05, but the embed token carries a username + role,
// so the semantic model filters rows before anything reaches the browser.
import express from 'express';
import { fileURLToPath } from 'node:url';
import { config, getReport, generateEmbedToken } from '../shared/powerbi.js';

// Demo "users". In a real app this comes from your own login, never from the browser.
const USERS = {
  alice: { username: 'alice@contoso.com', roles: ['Region'] },
  bob: { username: 'bob@contoso.com', roles: ['Region'] },
};

const app = express();
app.use(express.static(fileURLToPath(new URL('./public', import.meta.url))));

app.get('/api/embed-config', async (req, res) => {
  const user = USERS[req.query.user];
  if (!user) return res.status(400).json({ error: 'Unknown user' });
  try {
    const report = await getReport();
    const token = await generateEmbedToken({
      report,
      identities: [{ username: user.username, roles: user.roles, datasets: [report.datasetId] }],
    });
    res.json({
      reportId: report.id,
      embedUrl: report.embedUrl,
      accessToken: token.token,
      viewingAs: user.username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(config.port, () => console.log(`Ep06 running on http://localhost:${config.port}`));
