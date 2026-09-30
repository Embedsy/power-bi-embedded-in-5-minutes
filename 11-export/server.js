// Export the report as the user sees it (filters, slicers, page) to PDF or PowerPoint.
// The browser captures its current state; the server runs the Export To File job.
import { createApp, json, start } from '../shared/server.js';
import { embedConfig, exportReport } from '../shared/powerbi.js';

const FORMATS = ['PDF', 'PPTX', 'PNG'];

const app = createApp(import.meta.url);

app.get('/api/embed-config', json(() => embedConfig()));

app.post('/api/export', async (req, res) => {
  const { format, state } = req.body;
  if (!FORMATS.includes(format)) return res.status(400).json({ error: 'Unknown format' });
  try {
    const file = await exportReport({ format, state });
    res.attachment(file.fileName).send(file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

start(app);
