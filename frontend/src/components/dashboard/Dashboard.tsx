import React from 'react';
import { Box, Stack, CssBaseline } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AppNavbar from './components/AppNavbar';
import CustomerGrid from './components/CustomerGrid';
import SideMenu from './components/SideMenu';
import AppTheme from './theme/AppTheme';
import Header from './components/Header';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <Header />
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'space-between' }}>
          <SideMenu />
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <AppNavbar />
            {/* Main content */}
            <Box
              component="main"
              sx={(theme) => ({
                flexGrow: 1,
                backgroundColor: alpha(theme.palette.background.default, 1),
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
              })}
            >
              <Stack
                spacing={2}
                sx={{
                  alignItems: 'center',
                  pb: 5,
                  mt: { xs: 8, md: 0 },
                  flexGrow: 1,
                  width: '100%', // Ensure the stack takes the full width
                }}
              >
                <CustomerGrid />
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}