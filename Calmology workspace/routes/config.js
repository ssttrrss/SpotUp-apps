/**
 * Site Configuration Routes (ES Module)
 */

import express from 'express';
import { db } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/config - Get all configuration (public)
router.get('/', async (req, res) => {
    try {
        await db.read();
        res.json(db.data.config || {});
    } catch (error) {
        console.error('Get config error:', error);
        res.status(500).json({ error: 'Failed to get configuration' });
    }
});

// GET /api/config/:key - Get single config value (public)
router.get('/:key', async (req, res) => {
    try {
        await db.read();
        const value = db.data.config[req.params.key];

        if (value === undefined) {
            return res.status(404).json({ error: 'Config key not found' });
        }

        res.json({ key: req.params.key, value });
    } catch (error) {
        console.error('Get config key error:', error);
        res.status(500).json({ error: 'Failed to get configuration' });
    }
});

// PUT /api/config/:key - Update single config value (protected)
router.put('/:key', authenticateToken, async (req, res) => {
    try {
        const { value } = req.body;

        if (value === undefined) {
            return res.status(400).json({ error: 'Value is required' });
        }

        await db.read();
        db.data.config[req.params.key] = value;
        await db.write();

        res.json({
            success: true,
            key: req.params.key,
            value
        });
    } catch (error) {
        console.error('Update config error:', error);
        res.status(500).json({ error: 'Failed to update configuration' });
    }
});

// PUT /api/config - Bulk update config (protected)
router.put('/', authenticateToken, async (req, res) => {
    try {
        const updates = req.body;

        if (!updates || typeof updates !== 'object') {
            return res.status(400).json({ error: 'Config object required' });
        }

        await db.read();

        for (const [key, value] of Object.entries(updates)) {
            db.data.config[key] = String(value);
        }

        await db.write();

        res.json({
            success: true,
            message: 'Configuration updated',
            count: Object.keys(updates).length
        });
    } catch (error) {
        console.error('Bulk update config error:', error);
        res.status(500).json({ error: 'Failed to update configuration' });
    }
});

export default router;
