import * as React from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Logout from './Logout';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function NavBar (props) {
  const location = useLocation();
  console.log(location.state);
  const playerName = location.state ? location.state.playername : null;
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='fixed' color='primary'>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link
              variant='h5'
              color='secondary'
              underline='none'
              sx={{ fontWeight: 'bold' }}
              component={RouterLink}
              to={playerName ? '/join' : '/dashboard'}
            >
              BigBrain
            </Link>
            <Stack direction='row' alignItems='center' spacing={3}>
              {playerName
                ? (
                <Button
                  variant='contained'
                  color='tertiary'
                  size='large'
                  startIcon={<AccountCircleIcon />}>
                  {playerName}
                </Button>
                  )
                : (
                <Logout updatetoken={props.updatetoken} />
                  )}
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>
      <Toolbar />
      <Box
        sx={{ m: 2 }}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'top'}
        minHeight={'calc(100vh - 64px - 32px)'}
        >
        <Box width={'100%'} maxWidth={1200}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
