// document-service/src/routes/documents.js
const express = require('express');
const axios = require('axios');
const Document = require('../models/Document');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all documents (including shared ones)
router.get('/', auth, async (req, res) => {
    try {
        const documents = await Document.find({
            $or: [
                { owner: req.user.userId },
                { 'collaborators.userId': req.user.userId }
            ]
        });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Share document
router.post('/:id/share', auth, async (req, res) => {
    try {
        const { email, permission } = req.body;
        
        // Get user details from auth service
        try {
            const userResponse = await axios.post('http://localhost:3001/api/auth/user-by-email',
                { email },
                {
                    headers: {
                        'Authorization': req.header('Authorization')
                    }
                }
            );

            const userData = userResponse.data;

            const document = await Document.findOne({
                _id: req.params.id,
                owner: req.user.userId
            });

            if (!document) {
                return res.status(404).json({ error: 'Document not found' });
            }

            // Check if user is already a collaborator
            const existingCollaboratorIndex = document.collaborators.findIndex(
                c => c.userId.toString() === userData.userId.toString()
            );

            if (existingCollaboratorIndex !== -1) {
                // Update existing collaborator's permission
                document.collaborators[existingCollaboratorIndex].permission = permission;
            } else {
                // Add new collaborator
                document.collaborators.push({
                    userId: userData.userId,
                    email: userData.email,
                    permission
                });
            }

            await document.save();
            console.log('Updated document collaborators:', document.collaborators);
            res.json(document);

        } catch (error) {
            console.error('Error in user lookup:', error.response?.data || error.message);
            if (error.response?.status === 404) {
                return res.status(404).json({ error: 'User not found' });
            }
            throw error;
        }
    } catch (error) {
        console.error('Sharing error:', error);
        res.status(500).json({ error: error.message });
    }
});

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

// Get single document
router.get('/:id', auth, async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            $or: [
                { owner: req.user.userId },
                { 'collaborators.userId': req.user.userId }
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
                    { 'collaborators.userId': req.user.userId }
                ]
            },
            {
                ...req.body,
                lastModified: new Date()
            },
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