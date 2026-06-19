import { Router } from 'express';
import type { HealthResponse } from '@ams/shared';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  const payload: HealthResponse = {
    status: 'ok',
    service: 'ams-backend',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  };
  res.json(payload);
});
