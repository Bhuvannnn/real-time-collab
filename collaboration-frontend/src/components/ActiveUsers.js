// src/components/ActiveUsers.js
import React from 'react';
import { Box, Chip, Avatar, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const UserChip = styled(Chip)(({ theme, istyping }) => ({
    margin: theme.spacing(0.5),
    transition: 'all 0.3s ease',
    ...(istyping === 'true' && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        animation: 'pulse 1.5s infinite',
    }),
    '@keyframes pulse': {
        '0%': {
            boxShadow: '0 0 0 0 rgba(139, 126, 200, 0.4)',
            transform: 'scale(1)',
        },
        '50%': {
            boxShadow: '0 0 0 10px rgba(139, 126, 200, 0)',
            transform: 'scale(1.05)',
        },
        '100%': {
            boxShadow: '0 0 0 0 rgba(139, 126, 200, 0)',
            transform: 'scale(1)',
        },
    },
}));

function ActiveUsers({ users = [] }) {
    if (users.length === 0) return null;
    
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            {users.map((user) => (
                <Tooltip
                    key={user.id}
                    title={user.isTyping ? `${user.name} is typing...` : user.name}
                    arrow
                >
                    <UserChip
                        avatar={
                            <Avatar 
                                sx={{ 
                                    bgcolor: user.isTyping ? 'primary.main' : 'secondary.light',
                                    color: user.isTyping ? 'white' : 'secondary.dark',
                                    width: 32,
                                    height: 32,
                                    fontSize: '0.875rem',
                                    fontWeight: 600
                                }}
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                        }
                        label={user.name}
                        istyping={user.isTyping.toString()}
                        size="small"
                        sx={{
                            fontWeight: user.isTyping ? 600 : 400,
                            fontSize: '0.813rem'
                        }}
                    />
                </Tooltip>
            ))}
        </Box>
    );
}

export default ActiveUsers;