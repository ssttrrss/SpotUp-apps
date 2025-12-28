/**
 * Features Routes (ES Module)
 */

import express from 'express';
import { db, generateId, getNextSortOrder } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/features - Get all features (public)
router.get('/', async (req, res) => {
    try {
        await db.read();
        const features = [...(db.data.features || [])].sort((a, b) => a.sort_order - b.sort_order);
        res.json(features);
    } catch (error) {
        console.error('Get features error:', error);
        res.status(500).json({ error: 'Failed to get features' });
    }
});

// GET /api/features/:id - Get single feature (public)
router.get('/:id', async (req, res) => {
    try {
        await db.read();
        const feature = db.data.features.find(f => f.id === parseInt(req.params.id));

        if (!feature) {
            return res.status(404).json({ error: 'Feature not found' });
        }

        res.json(feature);
    } catch (error) {
        console.error('Get feature error:', error);
        res.status(500).json({ error: 'Failed to get feature' });
    }
});

// POST /api/features - Create new feature (protected)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { icon, title_en, title_ar, desc_en, desc_ar } = req.body;

        if (!title_en || !title_ar) {
            return res.status(400).json({ error: 'Title (EN/AR) is required' });
        }

        await db.read();

        const newFeature = {
            id: generateId('features'),
            icon: icon || 'fas fa-star',
            title_en,
            title_ar,
            desc_en: desc_en || '',
            desc_ar: desc_ar || '',
            sort_order: getNextSortOrder('features'),
            created_at: new Date().toISOString()
        };

        db.data.features.push(newFeature);
        await db.write();

        res.status(201).json({
            success: true,
            id: newFeature.id,
            message: 'Feature created'
        });
    } catch (error) {
        console.error('Create feature error:', error);
        res.status(500).json({ error: 'Failed to create feature' });
    }
});

// PUT /api/features/:id - Update feature (protected)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { icon, title_en, title_ar, desc_en, desc_ar, sort_order } = req.body;

        await db.read();

        const featIndex = db.data.features.findIndex(f => f.id === parseInt(req.params.id));
        if (featIndex === -1) {
            return res.status(404).json({ error: 'Feature not found' });
        }

        // Update fields
        const feat = db.data.features[featIndex];
        if (icon !== undefined) feat.icon = icon;
        if (title_en !== undefined) feat.title_en = title_en;
        if (title_ar !== undefined) feat.title_ar = title_ar;
        if (desc_en !== undefined) feat.desc_en = desc_en;
        if (desc_ar !== undefined) feat.desc_ar = desc_ar;
        if (sort_order !== undefined) feat.sort_order = sort_order;
        feat.updated_at = new Date().toISOString();

        await db.write();

        res.json({
            success: true,
            message: 'Feature updated'
        });
    } catch (error) {
        console.error('Update feature error:', error);
        res.status(500).json({ error: 'Failed to update feature' });
    }
});

// DELETE /api/features/:id - Delete feature (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await db.read();

        const featIndex = db.data.features.findIndex(f => f.id === parseInt(req.params.id));
        if (featIndex === -1) {
            return res.status(404).json({ error: 'Feature not found' });
        }

        db.data.features.splice(featIndex, 1);
        await db.write();

        res.json({ success: true, message: 'Feature deleted' });
    } catch (error) {
        console.error('Delete feature error:', error);
        res.status(500).json({ error: 'Failed to delete feature' });
    }
});

export default router;
