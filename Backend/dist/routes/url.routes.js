import express from 'express';
import { createShortUrl, redirectToOriginal, getShortUrlStats, getAllUrls } from '../controllers/url.controller.js';
const router = express.Router();
router.post('/shorten', createShortUrl);
router.get('/stats/:shortcode', getShortUrlStats);
router.get('/urls', getAllUrls);
router.get('/:shortcode', redirectToOriginal);
export default router;
