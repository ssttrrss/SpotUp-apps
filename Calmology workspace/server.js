/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  CALMOLOGY WORKSPACE - FULL-STACK SERVER (ES Modules)
 *  Node.js + Express + JSON Database
 *  Production-Ready REST API
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import configRoutes from './routes/config.js';
import pricingRoutes from './routes/pricing.js';
import locationsRoutes from './routes/locations.js';
import featuresRoutes from './routes/features.js';
import galleryRoutes from './routes/gallery.js';
import commentsRoutes from './routes/comments.js';

// Import database initialization
import { initDatabase } from './database/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

// ═══════════════════════════════════════════════════════════════════════════════
//  MIDDLEWARE SETUP
// ═══════════════════════════════════════════════════════════════════════════════

// Security headers (disabled contentSecurityPolicy for local dev)
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve uploads
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// ═══════════════════════════════════════════════════════════════════════════════
//  API ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Calmology API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Mount route modules
app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/features', featuresRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/comments', commentsRoutes);

// ═══════════════════════════════════════════════════════════════════════════════
//  CATCH-ALL ROUTES (SPA Support)
// ═══════════════════════════════════════════════════════════════════════════════

// Serve admin page
app.get('/admin', (req, res) => {
    res.sendFile(join(__dirname, 'admin.html'));
});

// Serve main page for all other routes
app.get('*', (req, res) => {
    // If request is for API, return 404
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(join(__dirname, 'index.html'));
});

// ═══════════════════════════════════════════════════════════════════════════════
//  ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
//  SERVER STARTUP
// ═══════════════════════════════════════════════════════════════════════════════

async function startServer() {
    try {
        // Initialize database with default data
        await initDatabase();
        console.log('✓ Database initialized');

        // Start server
        app.listen(PORT, () => {
            console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🧘 CALMOLOGY WORKSPACE SERVER                              ║
║                                                              ║
║   ✓ Server running on http://localhost:${PORT}                 ║
║   ✓ API available at http://localhost:${PORT}/api              ║
║   ✓ Admin panel at http://localhost:${PORT}/admin              ║
║                                                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
            `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

export default app;
