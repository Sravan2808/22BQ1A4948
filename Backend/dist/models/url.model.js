import mongoose from 'mongoose';
const urlSchema = new mongoose.Schema({
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
export default mongoose.model('Url', urlSchema);
