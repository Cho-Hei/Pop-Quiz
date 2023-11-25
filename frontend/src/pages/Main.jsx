import React from 'react';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import { Box, Button, Container } from '@mui/material';
import Grid from '@mui/material/Grid';
import { purple, yellow } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

const Main = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: purple[700],
      },
    },
  });

  const JoinButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(yellow[500]),
    backgroundColor: yellow[700],
    fontSize: 50,
    m: 100,
    '&:hover': {
      backgroundColor: yellow[400],
    },
  }));

  const LoginButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(yellow[500]),
    backgroundColor: yellow[700],
    fontSize: 50,
    m: 100,
    '&:hover': {
      backgroundColor: yellow[400],
    },
  }));

  const navigate = useNavigate();
  const JoinGame = () => {
    navigate('/join');
  };

  const ToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: theme.palette.primary.main,
          }}>
          <Container maxWidth='md'>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <JoinButton variant='contained' onClick={JoinGame}>
                  Join a game
                </JoinButton>
              </Grid>
              <Grid item xs={6}>
                <LoginButton variant='contained' onClick={ToLogin}>
                  Admin Login
                </LoginButton>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Main;
