// document-service/src/routes/documents.js
const express = require('express');
const axios = require('axios');
const Document = require('../models/Document');
const auth = require('../middleware/auth');
const router = express.Router();
const config = require('../config'); // Create this file for environment variables

// Get all documents (including shared ones)
router.get('/', auth, async (req, res) => {
    try {
        const documents = await Document.find({
            $or: [
                { owner: req.user.userId },
                { 'collaborators.userId': req.user.userId }
            ]
        });

        const documentsWithStringOwner = documents.map(doc => {
            const plainDoc = doc.toObject();
            plainDoc.owner = plainDoc.owner.toString();
            return plainDoc;
        });

        res.json(documentsWithStringOwner);
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: error.message });
    }
});

// Share document
router.post('/:id/share', auth, async (req, res) => {
    try {
        const { email, permission } = req.body;
        
        // Get user details from auth service
        try {
            const userResponse = await axios.post(`${process.env.AUTH_SERVICE_URL}/api/auth/user-by-email`, // Use environment variable
                { email },
                {
                    headers: {
                        'Authorization': req.header('Authorization')
                    }
                }
            );

            const userData = userResponse.data;
            console.log('User lookup successful:', userData);

            const document = await Document.findOne({
                _id: req.params.id,
                owner: req.user.userId
            });

            if (!document) {
                return res.status(404).json({ error: 'Document not found' });
            }

            const existingCollaboratorIndex = document.collaborators.findIndex(
                c => c.userId.toString() === userData.userId.toString()
            );

            if (existingCollaboratorIndex !== -1) {
                document.collaborators[existingCollaboratorIndex].permission = permission;
            } else {
                document.collaborators.push({
                    userId: userData.userId,
                    email: userData.email,
                    permission
                });
            }

            await document.save();
            console.log('Document shared successfully');
            res.json(document);

        } catch (error) {
            console.error('User lookup error:', error.response?.data || error.message);
            if (error.response?.status === 404) {
                return res.status(404).json({ error: 'User not found' });
            }
            throw error;
        }
    } catch (error) {
        console.error('Sharing error:', error);
        res.status(500).json({ error: 'Failed to share document' });
    }
});

// Create document
router.post('/', auth, async (req, res) => {
    try {
        console.log('Creating new document:', req.body);
        const document = new Document({
            ...req.body,
            owner: req.user.userId
        });
        await document.save();
        console.log('Document created successfully');
        res.status(201).json(document);
    } catch (error) {
        console.error('Error creating document:', error);
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

        console.log('Document retrieved successfully');
        res.json(document);
    } catch (error) {
        console.error('Error fetching document:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update document
router.patch('/:id', auth, async (req, res) => {
    try {
        console.log('Updating document:', req.params.id);
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

        if (req.body.title && document.owner.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Only the owner can change the document title' });
        }

        if (req.body.title) document.title = req.body.title;
        if (req.body.content) document.content = req.body.content;
        document.lastModified = new Date();

        await document.save();
        console.log('Document updated successfully');
        res.json(document);
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(400).json({ error: error.message });
    }
});

// Delete collaborator
router.delete('/:id/collaborators/:userId', auth, async (req, res) => {
    try {
        console.log('Removing collaborator from document:', req.params.id);
        const document = await Document.findOne({
            _id: req.params.id,
            owner: req.user.userId
        });

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

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
});

// Delete document
router.delete('/:id', auth, async (req, res) => {
    try {
        console.log('Deleting document:', req.params.id);
        const document = await Document.findOne({
            _id: req.params.id,
            owner: req.user.userId
        });

        if (!document) {
            return res.status(404).json({ error: 'Document not found or you are not the owner' });
        }

        await Document.deleteOne({ _id: req.params.id });
        console.log('Document deleted successfully');
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;