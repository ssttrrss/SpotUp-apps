/**
 * Comments Routes (ES Module)
 */

import express from 'express';
import { db, generateId } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════════════════
// USER COMMENTS
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/comments - Get approved comments (public)
router.get('/', async (req, res) => {
    try {
        await db.read();

        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const includeUnapproved = req.query.all === 'true';

        let comments = [...(db.data.comments || [])];

        // Filter by approved if needed
        if (!includeUnapproved) {
            comments = comments.filter(c => c.approved !== false);
        }

        // Sort by date (newest first)
        comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Paginate
        const total = comments.length;
        comments = comments.slice(offset, offset + limit);

        res.json({
            comments,
            total,
            limit,
            offset
        });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ error: 'Failed to get comments' });
    }
});

// GET /api/comments/all - Get all comments including unapproved (protected)
router.get('/all', authenticateToken, async (req, res) => {
    try {
        await db.read();
        const comments = [...(db.data.comments || [])].sort((a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        );
        res.json(comments);
    } catch (error) {
        console.error('Get all comments error:', error);
        res.status(500).json({ error: 'Failed to get comments' });
    }
});

// POST /api/comments - Submit new comment (public)
router.post('/', async (req, res) => {
    try {
        const { name, text } = req.body;

        if (!name || !text) {
            return res.status(400).json({ error: 'Name and text are required' });
        }

        await db.read();

        // Basic sanitization
        const newComment = {
            id: generateId('comments'),
            name: name.trim().substring(0, 100),
            text: text.trim().substring(0, 1000),
            approved: true,
            created_at: new Date().toISOString()
        };

        db.data.comments.push(newComment);
        await db.write();

        res.status(201).json({
            success: true,
            id: newComment.id,
            message: 'Comment submitted'
        });
    } catch (error) {
        console.error('Submit comment error:', error);
        res.status(500).json({ error: 'Failed to submit comment' });
    }
});

// PUT /api/comments/:id/approve - Approve comment (protected)
router.put('/:id/approve', authenticateToken, async (req, res) => {
    try {
        await db.read();

        const commentIndex = db.data.comments.findIndex(c => c.id === parseInt(req.params.id));
        if (commentIndex === -1) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        db.data.comments[commentIndex].approved = true;
        await db.write();

        res.json({ success: true, message: 'Comment approved' });
    } catch (error) {
        console.error('Approve comment error:', error);
        res.status(500).json({ error: 'Failed to approve comment' });
    }
});

// PUT /api/comments/:id/reject - Reject/hide comment (protected)
router.put('/:id/reject', authenticateToken, async (req, res) => {
    try {
        await db.read();

        const commentIndex = db.data.comments.findIndex(c => c.id === parseInt(req.params.id));
        if (commentIndex === -1) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        db.data.comments[commentIndex].approved = false;
        await db.write();

        res.json({ success: true, message: 'Comment rejected' });
    } catch (error) {
        console.error('Reject comment error:', error);
        res.status(500).json({ error: 'Failed to reject comment' });
    }
});

// DELETE /api/comments/:id - Delete comment (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await db.read();

        const commentIndex = db.data.comments.findIndex(c => c.id === parseInt(req.params.id));
        if (commentIndex === -1) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        db.data.comments.splice(commentIndex, 1);
        await db.write();

        res.json({ success: true, message: 'Comment deleted' });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
});

// ═══════════════════════════════════════════════════════════════════════════════
// TESTIMONIALS (Google Reviews - Admin managed)
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/comments/testimonials - Get all testimonials (public)
router.get('/testimonials', async (req, res) => {
    try {
        await db.read();
        const testimonials = db.data.testimonials || [];
        res.json(testimonials);
    } catch (error) {
        console.error('Get testimonials error:', error);
        res.status(500).json({ error: 'Failed to get testimonials' });
    }
});

// POST /api/comments/testimonials - Add testimonial (protected)
router.post('/testimonials', authenticateToken, async (req, res) => {
    try {
        const { name_en, name_ar, text_en, text_ar, rating } = req.body;

        if (!name_en || !name_ar || !text_en || !text_ar) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        await db.read();

        const newTestimonial = {
            id: generateId('testimonials'),
            name_en,
            name_ar,
            text_en,
            text_ar,
            rating: rating || 5,
            created_at: new Date().toISOString()
        };

        db.data.testimonials.push(newTestimonial);
        await db.write();

        res.status(201).json({
            success: true,
            id: newTestimonial.id,
            message: 'Testimonial added'
        });
    } catch (error) {
        console.error('Add testimonial error:', error);
        res.status(500).json({ error: 'Failed to add testimonial' });
    }
});

// PUT /api/comments/testimonials/:id - Update testimonial (protected)
router.put('/testimonials/:id', authenticateToken, async (req, res) => {
    try {
        const { name_en, name_ar, text_en, text_ar, rating } = req.body;

        await db.read();

        const testIndex = db.data.testimonials.findIndex(t => t.id === parseInt(req.params.id));
        if (testIndex === -1) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }

        // Update fields
        const test = db.data.testimonials[testIndex];
        if (name_en !== undefined) test.name_en = name_en;
        if (name_ar !== undefined) test.name_ar = name_ar;
        if (text_en !== undefined) test.text_en = text_en;
        if (text_ar !== undefined) test.text_ar = text_ar;
        if (rating !== undefined) test.rating = rating;

        await db.write();

        res.json({
            success: true,
            message: 'Testimonial updated'
        });
    } catch (error) {
        console.error('Update testimonial error:', error);
        res.status(500).json({ error: 'Failed to update testimonial' });
    }
});

// DELETE /api/comments/testimonials/:id - Delete testimonial (protected)
router.delete('/testimonials/:id', authenticateToken, async (req, res) => {
    try {
        await db.read();

        const testIndex = db.data.testimonials.findIndex(t => t.id === parseInt(req.params.id));
        if (testIndex === -1) {
            return res.status(404).json({ error: 'Testimonial not found' });
        }

        db.data.testimonials.splice(testIndex, 1);
        await db.write();

        res.json({ success: true, message: 'Testimonial deleted' });
    } catch (error) {
        console.error('Delete testimonial error:', error);
        res.status(500).json({ error: 'Failed to delete testimonial' });
    }
});

export default router;
