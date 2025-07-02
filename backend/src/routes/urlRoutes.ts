import { Router } from 'express';
import {
  shortenUrl,
  redirectUrl,
  getAnalytics,
} from '../controllers/urlController';

const router = Router();

router.post('/shorten', shortenUrl);
router.get('/:short_code', redirectUrl);
router.get('/analytics/:short_code', getAnalytics);

export default router;
