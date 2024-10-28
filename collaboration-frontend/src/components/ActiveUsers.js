// src/components/ActiveUsers.js
import React from 'react';
import { Box, Chip, Avatar, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const UserChip = styled(Chip)(({ theme, isTyping }) => ({
  margin: theme.spacing(0.5),
  animation: isTyping ? 'pulse 1.5s infinite' : 'none',
  '@keyframes pulse': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.4)',
    },
    '70%': {
      boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)',
    },
    '100%': {
      boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)',
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
            avatar={<Avatar>{user.name[0].toUpperCase()}</Avatar>}
            label={user.name}
            isTyping={user.isTyping}
            color={user.isTyping ? "primary" : "default"}
            variant={user.isTyping ? "filled" : "outlined"}
          />
        </Tooltip>
      ))}
    </Box>
  );
}

export default ActiveUsers;