import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import type { HealthResponse } from '@ams/shared';
import { apiRouter } from './routes/index.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  const payload: HealthResponse = {
    status: 'ok',
    service: 'ams-backend',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  };
  res.json(payload);
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`AMS backend listening on http://localhost:${PORT}`);
});
