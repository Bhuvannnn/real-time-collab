// src/components/ShareDialog.js
import React, { useState } from 'react';
import config from '../config';
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
    Chip,
    Box,
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
            const response = await fetch(`${config.DOCUMENT_URL}/api/documents/${document._id}/share`, {
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
        } catch (error) {
            console.error('Error sharing document:', error);
            setError(error.message || 'Failed to share document');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCollaborator = async (collaborator) => {
        try {
            setLoading(true);
            setError('');
            
            const token = localStorage.getItem('token');
            const response = await fetch(
                `${config.DOCUMENT_URL}/api/documents/${document._id}/collaborators/${collaborator.userId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to remove collaborator');
            }

            console.log('Collaborator removed successfully');
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
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >
            <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Share Document</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3, 
                            borderRadius: 2 
                        }}
                        onClose={() => setError('')}
                    >
                        {error}
                    </Alert>
                )}
                
                <Box sx={{ mb: 3, mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="dense"
                        error={!!error}
                        sx={{ mb: 2 }}
                    />
                    <Select
                        value={permission}
                        onChange={(e) => setPermission(e.target.value)}
                        fullWidth
                        margin="dense"
                        sx={{ borderRadius: 2 }}
                    >
                        <MenuItem value="read">Read Only</MenuItem>
                        <MenuItem value="write">Can Edit</MenuItem>
                    </Select>
                </Box>

                {collaborators && collaborators.length > 0 && (
                    <>
                        <Typography 
                            variant="subtitle1" 
                            sx={{ 
                                fontWeight: 600, 
                                mb: 2,
                                mt: 1
                            }}
                        >
                            Shared with ({collaborators.length})
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Permission</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {collaborators.map((collaborator) => (
                                    <TableRow key={collaborator.email}>
                                        <TableCell>{collaborator.email}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={collaborator.permission === 'write' ? 'Can Edit' : 'Read Only'}
                                                size="small"
                                                sx={{
                                                    bgcolor: collaborator.permission === 'write' ? 'primary.light' : 'grey.200',
                                                    color: collaborator.permission === 'write' ? 'primary.dark' : 'text.secondary'
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                                color="error"
                                                size="small"
                                                onClick={() => handleRemoveCollaborator(collaborator)}
                                                disabled={loading}
                                                sx={{ borderRadius: 2 }}
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
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button 
                    onClick={onClose} 
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleShare} 
                    variant="contained"
                    disabled={loading || !email}
                    sx={{ borderRadius: 2 }}
                >
                    {loading ? 'Sharing...' : 'Share'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ShareDialog;