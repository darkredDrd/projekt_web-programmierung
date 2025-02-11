import React from 'react';
import { Box, Drawer, Stack, Typography } from '@mui/material';
import { useRole } from '../../../services/RoleContext';
import OptionsMenu from './OptionsMenu';
import MenuContent from './MenuContent';

const SideMenu = () => {
  const { role } = useRole();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240, 
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240, 
          boxSizing: 'border-box',
        },
      }}
    >
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="caption" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {role}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
};

export default SideMenu;