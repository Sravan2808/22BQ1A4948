import Url from '../models/url.model.js';
import { generateShortCode } from '../utils/generateShortCode.js';
import dayjs from 'dayjs';
export const createShortUrl = async (req, res, next) => {
    try {
        const { originalUrl, validity = 30, shortcode } = req.body;
        if (!originalUrl) {
            return res.status(400).json({
                success: false,
                error: 'Original URL is required'
            });
        }
        let shortCode = shortcode;
        if (!shortCode) {
            shortCode = await generateShortCode();
        }
        const existing = await Url.findOne({ shortCode });
        if (existing) {
            return res.status(409).json({
                success: false,
                error: 'Shortcode already exists'
            });
        }
        const expiry = dayjs().add(validity, 'day').toDate();
        const newUrl = await Url.create({
            url: originalUrl,
            shortCode,
            expiry
        });
        res.status(201).json({
            success: true,
            data: {
                shortCode,
                originalUrl,
                createdAt: newUrl.createdAt.toISOString(),
                expiry: expiry.toISOString()
            }
        });
    }
    catch (err) {
        next(err);
    }
};
export const redirectToOriginal = async (req, res, next) => {
    try {
        const { shortcode } = req.params;
        const urlEntry = await Url.findOne({ shortCode: shortcode });
        if (!urlEntry) {
            return res.status(404).json({
                success: false,
                error: 'Short URL not found'
            });
        }
        if (new Date() > urlEntry.expiry) {
            return res.status(410).json({
                success: false,
                error: 'Link expired'
            });
        }
        urlEntry.clicks += 1;
        urlEntry.clickDetails.push({
            timestamp: new Date(),
            referrer: req.get('referrer') || '',
            ip: req.ip || req.connection.remoteAddress || '',
            userAgent: req.get('user-agent') || ''
        });
        await urlEntry.save();
        res.redirect(urlEntry.url);
    }
    catch (err) {
        next(err);
    }
};
export const getShortUrlStats = async (req, res, next) => {
    try {
        const { shortcode } = req.params;
        const urlEntry = await Url.findOne({ shortCode: shortcode });
        if (!urlEntry) {
            return res.status(404).json({
                success: false,
                error: 'Short URL not found'
            });
        }
        res.json({
            success: true,
            data: {
                shortCode: urlEntry.shortCode,
                originalUrl: urlEntry.url,
                clickCount: urlEntry.clicks,
                createdAt: urlEntry.createdAt.toISOString(),
                expiry: urlEntry.expiry.toISOString(),
                isExpired: new Date() > urlEntry.expiry,
                lastAccessed: urlEntry.clickDetails.length > 0
                    ? urlEntry.clickDetails[urlEntry.clickDetails.length - 1].timestamp.toISOString()
                    : null
            }
        });
    }
    catch (err) {
        next(err);
    }
};
export const getAllUrls = async (req, res, next) => {
    try {
        const urls = await Url.find({}).sort({ createdAt: -1 });
        const urlsData = urls.map(url => ({
            shortCode: url.shortCode,
            originalUrl: url.url,
            clickCount: url.clicks,
            createdAt: url.createdAt.toISOString(),
            expiry: url.expiry.toISOString(),
            isExpired: new Date() > url.expiry,
            lastAccessed: url.clickDetails.length > 0
                ? url.clickDetails[url.clickDetails.length - 1].timestamp.toISOString()
                : null
        }));
        res.json({
            success: true,
            data: urlsData
        });
    }
    catch (err) {
        next(err);
    }
};
