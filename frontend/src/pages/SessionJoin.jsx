import React, { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { generatePath, useNavigate } from 'react-router-dom';

const SessionJoin = () => {
  const [sessionid, SetSessionid] = useState('');
  console.log(sessionid);

  const navigate = useNavigate();

  const JoinSession = () => {
    console.log('Clicked go');
    navigate(generatePath('/join/:sessionid', { sessionid }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        // backgroundColor: theme.palette.primary.main,
      }}>
      <Typography variant='h1' sx={{ fontWeight: 'bold' }}>
        BigBrain
      </Typography>
      <Typography component='h2' variant='h4' sx={{ paddingBottom: '30px' }}>
        Have a session ID? Enter here!
      </Typography>
      <Container maxWidth='md'>
        <Grid container sx={{ justifyContent: 'center' }} spacing={1}>
          <Grid item>
            <TextField
              label='Session id'
              variant='outlined'
              name='session-id'
              onChange={(e) => SetSessionid(e.target.value)}
            />
          </Grid>

          <Grid item alignItems='stretch' style={{ display: 'flex' }}>
            <Button
              color='tertiary'
              variant='contained'
              name='join-session'
              onClick={JoinSession}>
              Let&apos;s go
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SessionJoin;
