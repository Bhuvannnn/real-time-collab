// src/components/UserPresence.js
import React from 'react';
import { Box, Avatar, Tooltip } from '@mui/material';

function UserPresence({ activeUsers }) {
    return (
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {activeUsers.map((userId, index) => (
                <Tooltip key={userId} title={`User ${userId}`}>
                    <Avatar 
                        sx={{ 
                            width: 30, 
                            height: 30,
                            bgcolor: `hsl(${(index * 137) % 360}, 70%, 50%)`
                        }}
                    >
                        {userId.slice(0, 2)}
                    </Avatar>
                </Tooltip>
            ))}
        </Box>
    );
}

export default UserPresence;