import express from 'express';

import { keys } from './constants.js';

const app = express();
app.get('/', (res) => {
  res.json({ version: '1.0.0' });
});

export const server = app.listen(keys.port || 5000, () => {
  const host = server.address().address;
  const { port } = server.address();
  console.log('Web server started at http://%s:%s', host, port);
});