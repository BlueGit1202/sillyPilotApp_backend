import express from 'express';
import path from 'node:path';
import cors from 'cors'
import Dotenv from 'dotenv'
import { fileURLToPath } from 'node:url';
import { corsOptions } from './config/corsOptions';
import { errorHandler} from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import apiRoutes from './routes';
import { database } from './services/database';
import morgan from 'morgan';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

Dotenv.config();
const port = Number(process.env.PORT) || 3001;
 initializeServer();
// Middleware
app.use(cors(corsOptions));
app.use(morgan("combined"));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(requestLogger);
// Routes
app.use('/api', apiRoutes);

// Error handler
app.use(errorHandler);

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Initialize server
async function initializeServer() {
    try {
        await database.initialize();
        // Listen on all network interfaces
        app.listen(port, '0.0.0.0', () => {
            console.log(`[${new Date().toISOString()}] Server running on port ${port}`);
            console.log(`[${new Date().toISOString()}] Access the app at http://<your-ip>:${port}`);
        });
    } catch (err) {
        console.error(`[${new Date().toISOString()}] Failed to initialize server:`, err);
        process.exit(1);
    }
}

