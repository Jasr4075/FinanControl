import { Router } from 'express';
import { refreshToken, revokeRefreshToken } from '../controllers/RefreshTokenController';

const router = Router();

router.post('/refresh', refreshToken);
router.post('/revoke', revokeRefreshToken);

export default router;
