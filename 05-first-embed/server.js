// Your first embedded report (app owns data).
// The browser never sees the client secret. It asks this server for an embed token.
import express from 'express';
import { fileURLToPath } from 'node:url';
import { config, getReport, generateEmbedToken } from '../shared/powerbi.js';

const app = express();
app.use(express.static(fileURLToPath(new URL('./public', import.meta.url))));

app.get('/api/embed-config', async (_req, res) => {
  try {
    const report = await getReport();
    const token = await generateEmbedToken({ reports: [report] });
    res.json({
      reportId: report.id,
      embedUrl: report.embedUrl,
      accessToken: token.token,
      expiration: token.expiration,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(config.port, () => console.log(`Running on http://localhost:${config.port}`));
