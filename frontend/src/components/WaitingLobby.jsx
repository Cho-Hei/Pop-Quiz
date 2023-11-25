import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const WaitingLobby = () => {
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '100vh',
          // backgroundColor: theme.palette.primary.main,
        }}>
        <CircularProgress className='LoadingImage' color='primary' size={200} />
        <Typography component='h1' variant='h5' sx={{ paddingTop: '30px' }}>
          Waiting to start
        </Typography>
      </Box>
    </div>
  );
};

export default WaitingLobby;
