import { Request, Response, NextFunction } from 'express';
import Url from '../models/url.model.js';
import { generateShortCode } from '../utils/generateShortCode.js';
import dayjs from 'dayjs';

export const createShortUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, validity = 30, shortcode } = req.body;
    
    // Validate URL
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let shortCode = shortcode;
    
    // Generate shortcode if not provided
    if (!shortCode) {
      shortCode = await generateShortCode();
    }

    // Check if shortcode already exists
    const existing = await Url.findOne({ shortCode });
    if (existing) {
      return res.status(409).json({ error: 'Shortcode already exists' });
    }

    const expiry = dayjs().add(validity, 'minute').toDate();
    const newUrl = await Url.create({ url, shortCode, expiry });

    res.status(201).json({
      shortLink: `${process.env.BASE_URL}/${shortCode}`,
      shortCode,
      expiry: expiry.toISOString(),
      originalUrl: url
    });
  } catch (err) {
    next(err);
  }
};

export const redirectToOriginal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shortcode } = req.params;
    const urlEntry = await Url.findOne({ shortCode: shortcode });

    if (!urlEntry) {
      return res.status(404).json({ error: 'Shortcode not found' });
    }
    
    if (new Date() > urlEntry.expiry) {
      return res.status(410).json({ error: 'Link expired' });
    }

    // Update click analytics
    urlEntry.clicks += 1;
    urlEntry.clickDetails.push({
      timestamp: new Date(),
      referrer: req.get('referrer') || '',
      ip: req.ip || req.connection.remoteAddress || '',
      userAgent: req.get('user-agent') || ''
    });

    await urlEntry.save();
    
    // Redirect to original URL
    res.redirect(urlEntry.url);
  } catch (err) {
    next(err);
  }
};

export const getShortUrlStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shortcode } = req.params;
    const urlEntry = await Url.findOne({ shortCode: shortcode });

    if (!urlEntry) {
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    res.json({
      shortCode: urlEntry.shortCode,
      originalUrl: urlEntry.url,
      totalClicks: urlEntry.clicks,
      expiry: urlEntry.expiry,
      createdAt: urlEntry.createdAt,
      isExpired: new Date() > urlEntry.expiry,
      clickDetails: urlEntry.clickDetails
    });
  } catch (err) {
    next(err);
  }
};