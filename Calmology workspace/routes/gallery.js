/**
 * Gallery Routes (ES Module)
 */

import express from 'express';
import multer from 'multer';
import { dirname, join, extname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { db, generateId, getNextSortOrder } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = join(__dirname, '..', 'uploads', 'gallery');
if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const ext = allowedTypes.test(extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (ext && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
});

// GET /api/gallery - Get all gallery images (public)
router.get('/', async (req, res) => {
    try {
        await db.read();
        const images = [...(db.data.gallery || [])].sort((a, b) => a.sort_order - b.sort_order);
        res.json(images);
    } catch (error) {
        console.error('Get gallery error:', error);
        res.status(500).json({ error: 'Failed to get gallery' });
    }
});

// POST /api/gallery - Add image URL (protected)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { image_url, alt_text } = req.body;

        if (!image_url) {
            return res.status(400).json({ error: 'Image URL is required' });
        }

        await db.read();

        const newImage = {
            id: generateId('gallery'),
            image_url,
            alt_text: alt_text || '',
            sort_order: getNextSortOrder('gallery'),
            created_at: new Date().toISOString()
        };

        db.data.gallery.push(newImage);
        await db.write();

        res.status(201).json({
            success: true,
            id: newImage.id,
            message: 'Image added'
        });
    } catch (error) {
        console.error('Add gallery image error:', error);
        res.status(500).json({ error: 'Failed to add image' });
    }
});

// POST /api/gallery/upload - Upload image file (protected)
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const imageUrl = `/uploads/gallery/${req.file.filename}`;

        await db.read();

        const newImage = {
            id: generateId('gallery'),
            image_url: imageUrl,
            alt_text: req.body.alt_text || '',
            sort_order: getNextSortOrder('gallery'),
            created_at: new Date().toISOString()
        };

        db.data.gallery.push(newImage);
        await db.write();

        res.status(201).json({
            success: true,
            id: newImage.id,
            image_url: imageUrl,
            message: 'Image uploaded'
        });
    } catch (error) {
        console.error('Upload gallery image error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// PUT /api/gallery/:id - Update image (protected)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { image_url, alt_text, sort_order } = req.body;

        await db.read();

        const imgIndex = db.data.gallery.findIndex(g => g.id === parseInt(req.params.id));
        if (imgIndex === -1) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Update fields
        const img = db.data.gallery[imgIndex];
        if (image_url !== undefined) img.image_url = image_url;
        if (alt_text !== undefined) img.alt_text = alt_text;
        if (sort_order !== undefined) img.sort_order = sort_order;

        await db.write();

        res.json({
            success: true,
            message: 'Image updated'
        });
    } catch (error) {
        console.error('Update gallery image error:', error);
        res.status(500).json({ error: 'Failed to update image' });
    }
});

// DELETE /api/gallery/:id - Delete image (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await db.read();

        const imgIndex = db.data.gallery.findIndex(g => g.id === parseInt(req.params.id));
        if (imgIndex === -1) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const image = db.data.gallery[imgIndex];

        // Delete local file if it exists
        if (image.image_url.startsWith('/uploads/')) {
            const filePath = join(__dirname, '..', image.image_url);
            if (existsSync(filePath)) {
                unlinkSync(filePath);
            }
        }

        db.data.gallery.splice(imgIndex, 1);
        await db.write();

        res.json({ success: true, message: 'Image deleted' });
    } catch (error) {
        console.error('Delete gallery image error:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

export default router;
