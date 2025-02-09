import React from 'react';
import { Box, Stack, CssBaseline, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AppNavbar from './components/AppNavbar';
import CustomerGrid from './components/CustomerGrid';
import OffersGrid from './components/OffersGrid';
import SideMenu from './components/SideMenu';
import AppTheme from './theme/AppTheme';
import Header from './components/Header';
import { Routes, Route } from 'react-router-dom';
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
                <Routes>
                  <Route path="/offers" element={<OffersGrid />} />
                  <Route path="/customers" element={<CustomerGrid />} />
                </Routes>
              </Stack>
            </Box>
            {/* Footer */}
            <Box
              component="footer"
              sx={{
                backgroundColor: 'grey',
                color: 'white',
                textAlign: 'center',
                py: 2,
              }}
            >
              <Typography variant="body2">Made by Niclas Schmidt und Timo Haberkorn</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}