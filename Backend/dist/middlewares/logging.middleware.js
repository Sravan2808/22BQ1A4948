import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logStream = fs.createWriteStream(path.join(__dirname, '../../logs.txt'), { flags: 'a' });
const loggingMiddleware = (req, res, next) => {
    const log = `${new Date().toISOString()} ${req.method} ${req.originalUrl}\n`;
    logStream.write(log);
    next();
};
export default loggingMiddleware;
