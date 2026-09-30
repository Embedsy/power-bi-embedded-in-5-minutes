// Small Express helpers so each sample's server.js only shows its own routes.
import express from 'express';
import { fileURLToPath } from 'node:url';
import { config } from './powerbi.js';

// App serving ./public next to the calling server.js
export function createApp(serverUrl) {
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use(express.static(fileURLToPath(new URL('./public', serverUrl))));
  return app;
}

// Wrap an async route: JSON result on success, { error } with 500 on failure.
export const json = (fn) => async (req, res) => {
  try {
    res.json(await fn(req, res));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export function start(app) {
  app.listen(config.port, () => console.log(`Running on http://localhost:${config.port}`));
}
