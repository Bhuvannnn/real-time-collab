// document-service/src/routes/documents.js
const express = require('express');
const axios = require('axios');
const Document = require('../models/Document');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all documents (including shared ones)
// document-service/src/routes/documents.js
// Update the GET route to return the owner ID as a string
router.get('/', auth, async (req, res) => {
    try {
        const documents = await Document.find({
            $or: [
                { owner: req.user.userId },
                { 'collaborators.userId': req.user.userId }
            ]
        });

        // Convert documents to plain objects and ensure owner is a string
        const documentsWithStringOwner = documents.map(doc => {
            const plainDoc = doc.toObject();
            plainDoc.owner = plainDoc.owner.toString();
            return plainDoc;
        });

        res.json(documentsWithStringOwner);
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

        // Only owner can change title
        if (req.body.title && document.owner.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Only the owner can change the document title' });
        }

        // Update allowed fields
        if (req.body.title) document.title = req.body.title;
        if (req.body.content) document.content = req.body.content;
        document.lastModified = new Date();

        await document.save();
        res.json(document);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add or update this route for removing collaborators
router.delete('/:id/collaborators/:userId', auth, async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            owner: req.user.userId // Only document owner can remove collaborators
        });

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Remove the collaborator
        document.collaborators = document.collaborators.filter(
            collaborator => collaborator.userId.toString() !== req.params.userId
        );

        await document.save();
        console.log('Collaborator removed successfully');
        res.json({ message: 'Collaborator removed successfully' });
    } catch (error) {
        console.error('Error removing collaborator:', error);
        res.status(500).json({ error: error.message });
    }

    router.delete('/:id', auth, async (req, res) => {
        try {
            const document = await Document.findOne({
                _id: req.params.id,
                owner: req.user.userId // Only owner can delete
            });
    
            if (!document) {
                return res.status(404).json({ error: 'Document not found or you are not the owner' });
            }
    
            await Document.deleteOne({ _id: req.params.id });
            res.json({ message: 'Document deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
});

module.exports = router;