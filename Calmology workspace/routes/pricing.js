/**
 * Pricing Plans Routes (ES Module)
 */

import express from 'express';
import { db, generateId, getNextSortOrder } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/pricing - Get all pricing plans (public)
router.get('/', async (req, res) => {
    try {
        await db.read();
        const plans = [...(db.data.pricing_plans || [])].sort((a, b) => a.sort_order - b.sort_order);
        res.json(plans);
    } catch (error) {
        console.error('Get pricing error:', error);
        res.status(500).json({ error: 'Failed to get pricing plans' });
    }
});

// GET /api/pricing/:id - Get single plan (public)
router.get('/:id', async (req, res) => {
    try {
        await db.read();
        const plan = db.data.pricing_plans.find(p => p.id === parseInt(req.params.id));

        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        res.json(plan);
    } catch (error) {
        console.error('Get plan error:', error);
        res.status(500).json({ error: 'Failed to get plan' });
    }
});

// POST /api/pricing - Create new plan (protected)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const {
            name_en, name_ar, price, unit, icon, is_popular,
            features_en, features_ar
        } = req.body;

        if (!name_en || !name_ar || price === undefined) {
            return res.status(400).json({ error: 'Name (EN/AR) and price are required' });
        }

        await db.read();

        // If this is marked as popular, unmark others
        if (is_popular) {
            db.data.pricing_plans.forEach(p => p.is_popular = false);
        }

        const newPlan = {
            id: generateId('pricing_plans'),
            name_en,
            name_ar,
            price,
            unit: unit || 'EGP',
            icon: icon || 'fas fa-tag',
            is_popular: is_popular || false,
            features_en: features_en || [],
            features_ar: features_ar || [],
            sort_order: getNextSortOrder('pricing_plans'),
            created_at: new Date().toISOString()
        };

        db.data.pricing_plans.push(newPlan);
        await db.write();

        res.status(201).json({
            success: true,
            id: newPlan.id,
            message: 'Plan created'
        });
    } catch (error) {
        console.error('Create plan error:', error);
        res.status(500).json({ error: 'Failed to create plan' });
    }
});

// PUT /api/pricing/:id - Update plan (protected)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const {
            name_en, name_ar, price, unit, icon, is_popular,
            features_en, features_ar, sort_order
        } = req.body;

        await db.read();

        const planIndex = db.data.pricing_plans.findIndex(p => p.id === parseInt(req.params.id));
        if (planIndex === -1) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        // If this is marked as popular, unmark others
        if (is_popular) {
            db.data.pricing_plans.forEach((p, idx) => {
                if (idx !== planIndex) p.is_popular = false;
            });
        }

        // Update fields
        const plan = db.data.pricing_plans[planIndex];
        if (name_en !== undefined) plan.name_en = name_en;
        if (name_ar !== undefined) plan.name_ar = name_ar;
        if (price !== undefined) plan.price = price;
        if (unit !== undefined) plan.unit = unit;
        if (icon !== undefined) plan.icon = icon;
        if (is_popular !== undefined) plan.is_popular = is_popular;
        if (features_en !== undefined) plan.features_en = features_en;
        if (features_ar !== undefined) plan.features_ar = features_ar;
        if (sort_order !== undefined) plan.sort_order = sort_order;
        plan.updated_at = new Date().toISOString();

        await db.write();

        res.json({
            success: true,
            message: 'Plan updated'
        });
    } catch (error) {
        console.error('Update plan error:', error);
        res.status(500).json({ error: 'Failed to update plan' });
    }
});

// DELETE /api/pricing/:id - Delete plan (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await db.read();

        const planIndex = db.data.pricing_plans.findIndex(p => p.id === parseInt(req.params.id));
        if (planIndex === -1) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        db.data.pricing_plans.splice(planIndex, 1);
        await db.write();

        res.json({ success: true, message: 'Plan deleted' });
    } catch (error) {
        console.error('Delete plan error:', error);
        res.status(500).json({ error: 'Failed to delete plan' });
    }
});

export default router;
