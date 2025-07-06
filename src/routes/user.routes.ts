import { Router } from 'express';

import { createUserController, getAllUsersController } from '@/controllers/user.controllers';

const router = Router();

router.route('/').get(getAllUsersController).post(createUserController);

export default router;
