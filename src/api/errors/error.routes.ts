import { Router } from 'express';
import { handleAll, fallback } from './error.controllers';

const router = Router();

router.use(fallback);
router.use(handleAll);

export default router;
