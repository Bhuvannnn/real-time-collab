// document-service/src/models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    collaborators: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
        email: String,
        permission: {
            type: String,
            enum: ['read', 'write'],
            default: 'write'
        }
    }],
    lastModified: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Document', documentSchema);