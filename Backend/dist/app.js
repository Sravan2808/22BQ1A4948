import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import urlRoutes from './routes/url.routes.js';
import loggingMiddleware from './middlewares/logging.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());
app.use(loggingMiddleware);
app.use('/api', urlRoutes);
app.use('/', urlRoutes);
app.use(errorHandler);
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('❌ MONGO_URI not found in .env file');
    process.exit(1);
}
mongoose
    .connect(mongoUri)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
export default app;
