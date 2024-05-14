import { Router } from 'express';
import { AuthRoutes } from './auth';
import { AdminRoutes } from './admin';
import { MoivesRoutes } from './movies';


const router = Router();

router.use('/auth', AuthRoutes);
router.use('/admin', AdminRoutes);
router.use('/movies', MoivesRoutes);

export const indexRouter: Router = router;
