const express = require('express');
const Document = require('../models/Document');
const auth = require('../middleware/auth');
const router = express.Router();

// Create document
router.post('/', auth, async (req, res) => {
    try {
        const document = new Document({
            ...req.body,
            owner: req.user.userId
        });
        await document.save();
        res.status(201).json(document);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all documents for user
router.get('/', auth, async (req, res) => {
    try {
        const documents = await Document.find({
            $or: [
                { owner: req.user.userId },
                { collaborators: req.user.userId }
            ]
        });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single document
router.get('/:id', auth, async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            $or: [
                { owner: req.user.userId },
                { collaborators: req.user.userId }
            ]
        });
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update document
router.patch('/:id', auth, async (req, res) => {
    try {
        const document = await Document.findOneAndUpdate(
            {
                _id: req.params.id,
                $or: [
                    { owner: req.user.userId },
                    { collaborators: req.user.userId }
                ]
            },
            req.body,
            { new: true }
        );
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json(document);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;