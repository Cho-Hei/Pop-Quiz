import React, { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Fade,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

const GameJoin = ({
  onJoin,
  sessionerror,
  onChangeSessionError,
  sessionerrormsg,
  onChangeSessionErrormsg,
  sessionEnd,
  onChangeSessionEnd,
}) => {
  const [playername, SetPlayerName] = useState('');
  const [JoinError, SetJoinError] = useState(false);
  const [JoinErrormsg, SetJoinErrormsg] = useState('');
  console.log(playername);

  const Checkname = (name) => {
    if (name === '') {
      SetJoinErrormsg('Name cannot be blank');
      SetJoinError(true);
      return false;
    }

    return true;
  };

  const JoinGame = () => {
    console.log('Clicked go');
    if (!Checkname(playername)) {
      return;
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        name: playername,
      }),
    };

    onJoin(options, playername);
  };

  const handleSessionError = (state) => {
    onChangeSessionError(state);
  };

  const handleSessionErrormsg = (state) => {
    onChangeSessionErrormsg(state);
  };

  const handleSessionEnd = (state) => {
    onChangeSessionEnd(state);
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '100vh',
        }}>
        <>
          {sessionEnd
            ? (
            <>
              <Fade
                in={sessionEnd}
                timeout={{ enter: 1000, exit: 0 }}
                addEndListener={() => {
                  setTimeout(() => {
                    handleSessionEnd(false);
                  }, 5000);
                }}>
                <Alert severity='error' variant='standard' className='alert'>
                  <AlertTitle className='AlertTitle'>Error</AlertTitle>
                  Session already Ended
                </Alert>
              </Fade>
            </>
              )
            : JoinError
              ? (
            <Fade
              in={JoinError}
              timeout={{ enter: 1000, exit: 0 }}
              addEndListener={() => {
                setTimeout(() => {
                  SetJoinError(false);
                  SetJoinErrormsg('');
                }, 5000);
              }}>
              <Alert severity='error' variant='standard' className='alert'>
                <AlertTitle className='AlertTitle'>Error</AlertTitle>
                {JoinErrormsg}
              </Alert>
            </Fade>
                )
              : (
            <Fade
              in={sessionerror}
              timeout={{ enter: 1000, exit: 0 }}
              addEndListener={() => {
                setTimeout(() => {
                  handleSessionError(false);
                  handleSessionErrormsg('');
                }, 5000);
              }}>
              <Alert severity='warning' variant='standard' className='alert'>
                <AlertTitle className='AlertTitle'>Error</AlertTitle>
                {sessionerrormsg}
              </Alert>
            </Fade>
                )}
        </>
        <Typography variant='h1' sx={{ fontWeight: 'bold' }}>
          BigBrain
        </Typography>
        <Typography component='h2' variant='h4' sx={{ paddingBottom: '30px' }}>
          Enter Your Name
        </Typography>
        <Container maxWidth='md'>
          <Grid container sx={{ justifyContent: 'center' }} spacing={1}>
            <Grid item>
              <TextField
                label='Name'
                name='name'
                variant='outlined'
                onChange={(e) => SetPlayerName(e.target.value)}
              />
            </Grid>

            <Grid item alignItems='stretch' style={{ display: 'flex' }}>
              <Button
                color='tertiary'
                variant='contained'
                name='play-start'
                onClick={JoinGame}>
                Play!
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default GameJoin;
