// src/components/ShareDialog.js
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Select,
    MenuItem,
    Typography,
    Alert,
} from '@mui/material';

function ShareDialog({ open, onClose, document, onShare, collaborators = [] }) {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState('write');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleShare = async () => {
        try {
            setError('');
            setLoading(true);
            
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3002/api/documents/${document._id}/share`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    permission
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to share document');
            }

            setEmail('');
            if (onShare) {
                onShare();
            }
            
            // Show success message or close dialog
            onClose();
        } catch (error) {
            console.error('Error sharing document:', error);
            setError(error.message || 'Failed to share document');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCollaborator = async (userId) => {
        try {
            setLoading(true);
            setError('');
            
            const token = localStorage.getItem('token');
            const response = await fetch(
                `http://localhost:3002/api/documents/${document._id}/collaborators/${userId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to remove collaborator');
            }

            if (onShare) {
                onShare(); // Refresh the collaborators list
            }
        } catch (error) {
            console.error('Error removing collaborator:', error);
            setError(error.message || 'Failed to remove collaborator');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Share Document</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                <div style={{ marginBottom: '20px', marginTop: '10px' }}>
                    <TextField
                        fullWidth
                        label="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="dense"
                        error={!!error}
                    />
                    <Select
                        value={permission}
                        onChange={(e) => setPermission(e.target.value)}
                        fullWidth
                        margin="dense"
                        style={{ marginTop: '10px' }}
                    >
                        <MenuItem value="read">Read</MenuItem>
                        <MenuItem value="write">Write</MenuItem>
                    </Select>
                </div>

                {collaborators.length > 0 && (
                    <>
                        <Typography variant="h6">Shared with</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Permission</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {collaborators.map((collaborator) => (
                                    <TableRow key={collaborator.email}>
                                        <TableCell>{collaborator.email}</TableCell>
                                        <TableCell>{collaborator.permission}</TableCell>
                                        <TableCell>
                                            <Button 
                                                color="error"
                                                onClick={() => handleRemoveCollaborator(collaborator.userId)}
                                                disabled={loading}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button 
                    onClick={handleShare} 
                    color="primary"
                    disabled={loading || !email}
                >
                    {loading ? 'Sharing...' : 'Share'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ShareDialog;