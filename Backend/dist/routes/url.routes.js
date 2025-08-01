import express from 'express';
import { createShortUrl, redirectToOriginal, getShortUrlStats } from '../controllers/url.controller.js';
const router = express.Router();
// Create short URL
router.post('/', createShortUrl);
// Get stats for a shortcode (more specific route first)
router.get('/:shortcode/stats', getShortUrlStats);
// Redirect to original URL (catch-all route last)
router.get('/:shortcode', redirectToOriginal);
export default router;
