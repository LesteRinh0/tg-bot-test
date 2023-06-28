import express from 'express';

export const app = express();
app.get('/', (res) => {
  res.json({ version: '1.0.0' });
});