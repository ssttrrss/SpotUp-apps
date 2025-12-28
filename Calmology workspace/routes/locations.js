/**
 * Locations Routes (ES Module)
 */

import express from 'express';
import { db, generateId } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/locations - Get all locations (public)
router.get('/', async (req, res) => {
    try {
        await db.read();
        const locations = [...(db.data.locations || [])].sort((a, b) => {
            // Primary first, then by id
            if (a.is_primary && !b.is_primary) return -1;
            if (!a.is_primary && b.is_primary) return 1;
            return a.id - b.id;
        });
        res.json(locations);
    } catch (error) {
        console.error('Get locations error:', error);
        res.status(500).json({ error: 'Failed to get locations' });
    }
});

// GET /api/locations/:id - Get single location (public)
router.get('/:id', async (req, res) => {
    try {
        await db.read();
        const location = db.data.locations.find(l => l.id === parseInt(req.params.id));

        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }

        res.json(location);
    } catch (error) {
        console.error('Get location error:', error);
        res.status(500).json({ error: 'Failed to get location' });
    }
});

// POST /api/locations - Create new location (protected)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const {
            name_en, name_ar, address_en, address_ar,
            phone, whatsapp, hours_en, hours_ar, map_url, is_primary
        } = req.body;

        if (!name_en || !name_ar || !address_en || !address_ar) {
            return res.status(400).json({ error: 'Name and address (EN/AR) are required' });
        }

        await db.read();

        // If this is marked as primary, unmark others
        if (is_primary) {
            db.data.locations.forEach(l => l.is_primary = false);
        }

        const newLocation = {
            id: generateId('locations'),
            name_en,
            name_ar,
            address_en,
            address_ar,
            phone: phone || '',
            whatsapp: whatsapp || '',
            hours_en: hours_en || 'Open 24 Hours',
            hours_ar: hours_ar || 'مفتوح ٢٤ ساعة',
            map_url: map_url || '',
            is_primary: is_primary || false,
            created_at: new Date().toISOString()
        };

        db.data.locations.push(newLocation);
        await db.write();

        res.status(201).json({
            success: true,
            id: newLocation.id,
            message: 'Location created'
        });
    } catch (error) {
        console.error('Create location error:', error);
        res.status(500).json({ error: 'Failed to create location' });
    }
});

// PUT /api/locations/:id - Update location (protected)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const {
            name_en, name_ar, address_en, address_ar,
            phone, whatsapp, hours_en, hours_ar, map_url, is_primary
        } = req.body;

        await db.read();

        const locIndex = db.data.locations.findIndex(l => l.id === parseInt(req.params.id));
        if (locIndex === -1) {
            return res.status(404).json({ error: 'Location not found' });
        }

        // If this is marked as primary, unmark others
        if (is_primary) {
            db.data.locations.forEach((l, idx) => {
                if (idx !== locIndex) l.is_primary = false;
            });
        }

        // Update fields
        const loc = db.data.locations[locIndex];
        if (name_en !== undefined) loc.name_en = name_en;
        if (name_ar !== undefined) loc.name_ar = name_ar;
        if (address_en !== undefined) loc.address_en = address_en;
        if (address_ar !== undefined) loc.address_ar = address_ar;
        if (phone !== undefined) loc.phone = phone;
        if (whatsapp !== undefined) loc.whatsapp = whatsapp;
        if (hours_en !== undefined) loc.hours_en = hours_en;
        if (hours_ar !== undefined) loc.hours_ar = hours_ar;
        if (map_url !== undefined) loc.map_url = map_url;
        if (is_primary !== undefined) loc.is_primary = is_primary;
        loc.updated_at = new Date().toISOString();

        await db.write();

        res.json({
            success: true,
            message: 'Location updated'
        });
    } catch (error) {
        console.error('Update location error:', error);
        res.status(500).json({ error: 'Failed to update location' });
    }
});

// DELETE /api/locations/:id - Delete location (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await db.read();

        const locIndex = db.data.locations.findIndex(l => l.id === parseInt(req.params.id));
        if (locIndex === -1) {
            return res.status(404).json({ error: 'Location not found' });
        }

        db.data.locations.splice(locIndex, 1);
        await db.write();

        res.json({ success: true, message: 'Location deleted' });
    } catch (error) {
        console.error('Delete location error:', error);
        res.status(500).json({ error: 'Failed to delete location' });
    }
});

export default router;
