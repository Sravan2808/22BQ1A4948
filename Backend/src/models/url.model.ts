import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  expiry: { type: Date, required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  clickDetails: [{
    timestamp: Date,
    referrer: String,
    ip: String,
    userAgent: String
  }]
});

export default mongoose.model('Url', urlSchema);
