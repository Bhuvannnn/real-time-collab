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
            boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)',
            transform: 'scale(1)',
        },
        '50%': {
            boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)',
            transform: 'scale(1.05)',
        },
        '100%': {
            boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
            transform: 'scale(1)',
        },
    },
}));

function ActiveUsers({ users = [] }) {
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, p: 1 }}>
            {users.map((user) => (
                <Tooltip
                    key={user.id}
                    title={user.isTyping ? `${user.name} is typing...` : user.name}
                >
                    <UserChip
                        avatar={
                            <Avatar 
                                sx={{ 
                                    bgcolor: user.isTyping ? 'primary.dark' : 'default',
                                    color: user.isTyping ? 'white' : 'inherit'
                                }}
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                        }
                        label={user.name}
                        istyping={user.isTyping.toString()}
                        sx={{
                            fontWeight: user.isTyping ? 500 : 400
                        }}
                    />
                </Tooltip>
            ))}
        </Box>
    );
}

export default ActiveUsers;