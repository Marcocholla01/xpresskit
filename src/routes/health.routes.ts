import express from 'express';

import type { Request, Response } from 'express';

const router = express.Router();

router.get('/', (_req: Request, _res: Response) => {
  _res.send('<a href="/status-monitor">Monitor</a>');
});

export default router;
