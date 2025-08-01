import mongoose from 'mongoose';

interface ClickDetail {
  timestamp: Date;
  referrer: string;
  ip: string;
  userAgent: string;
}

interface UrlDocument extends mongoose.Document {
  url: string;
  shortCode: string;
  expiry: Date;
  clicks: number;
  createdAt: Date;
  clickDetails: ClickDetail[];
}

const urlSchema = new mongoose.Schema<UrlDocument>({
  url: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  expiry: { type: Date, required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  clickDetails: [{
    timestamp: { type: Date, required: true, default: Date.now },
    referrer: { type: String, default: '' },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' }
  }]
});

export default mongoose.model<UrlDocument>('Url', urlSchema);
