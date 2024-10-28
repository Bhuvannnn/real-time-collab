const activeDocuments = new Map(); // Store active documents and their users
const typingUsers = new Map(); // Store who is currently typing

const documentHandlers = (io, socket) => {
    const joinDocument = async (documentId) => {
        socket.join(documentId);
        
        // Add user to active documents with their name
        if (!activeDocuments.has(documentId)) {
            activeDocuments.set(documentId, new Map());
        }
        activeDocuments.get(documentId).set(socket.userId, {
            id: socket.userId,
            name: socket.userName, // This will come from auth
            isTyping: false
        });
        
        // Notify others about new user
        socket.to(documentId).emit('user-joined', {
            userId: socket.userId,
            userName: socket.userName,
            documentId
        });

        // Send current active users to the joining user
        io.to(documentId).emit('active-users', {
            documentId,
            users: Array.from(activeDocuments.get(documentId).values())
        });
    };

    const leaveDocument = (documentId) => {
        socket.leave(documentId);
        
        // Remove user from active documents
        if (activeDocuments.has(documentId)) {
            activeDocuments.get(documentId).delete(socket.userId);
            if (activeDocuments.get(documentId).size === 0) {
                activeDocuments.delete(documentId);
            }
        }
        
        // Remove from typing users
        if (typingUsers.has(documentId)) {
            typingUsers.get(documentId).delete(socket.userId);
        }
        
        // Notify others about user leaving
        io.to(documentId).emit('user-left', {
            userId: socket.userId,
            documentId
        });

        // Update active users list
        if (activeDocuments.has(documentId)) {
            io.to(documentId).emit('active-users', {
                documentId,
                users: Array.from(activeDocuments.get(documentId).values())
            });
        }
    };

    const handleTypingStart = (documentId) => {
        if (!typingUsers.has(documentId)) {
            typingUsers.set(documentId, new Set());
        }
        typingUsers.get(documentId).add(socket.userId);
        
        if (activeDocuments.has(documentId)) {
            const userMap = activeDocuments.get(documentId);
            if (userMap.has(socket.userId)) {
                userMap.get(socket.userId).isTyping = true;
            }
        }

        // Broadcast typing status to all users in the document
        io.to(documentId).emit('typing-update', {
            documentId,
            users: Array.from(activeDocuments.get(documentId).values())
        });
    };

    const handleTypingEnd = (documentId) => {
        if (typingUsers.has(documentId)) {
            typingUsers.get(documentId).delete(socket.userId);
        }
        
        if (activeDocuments.has(documentId)) {
            const userMap = activeDocuments.get(documentId);
            if (userMap.has(socket.userId)) {
                userMap.get(socket.userId).isTyping = false;
            }
        }

        // Broadcast typing status update
        io.to(documentId).emit('typing-update', {
            documentId,
            users: Array.from(activeDocuments.get(documentId).values())
        });
    };

    // Add this new handler for document changes
    const handleDocumentChange = (data) => {
        console.log('Document change received:', data);
        // Broadcast changes to all users in the document except sender
        socket.to(data.documentId).emit('document-changed', {
            ...data,
            userId: socket.userId,
            userName: socket.userName
        });
    };

    // Register all event handlers
    socket.on('join-document', joinDocument);
    socket.on('leave-document', leaveDocument);
    socket.on('typing-start', handleTypingStart);
    socket.on('typing-end', handleTypingEnd);
    socket.on('document-change', handleDocumentChange);  // Added this line

    // Clean up when user disconnects
    socket.on('disconnect', () => {
        activeDocuments.forEach((users, documentId) => {
            if (users.has(socket.userId)) {
                leaveDocument(documentId);
            }
        });
    });
};

module.exports = documentHandlers;