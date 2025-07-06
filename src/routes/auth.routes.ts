import { Router } from 'express';

import {
  loginUserController,
  refreshTokenController,
  registerUserController,
} from '@/controllers/auth.controllers';

const router = Router();

router.route('/register').post(registerUserController);
router.route('/login').post(loginUserController);
router.route('/refresh').post(refreshTokenController);

export default router;
