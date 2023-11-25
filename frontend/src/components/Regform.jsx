import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Fade from '@mui/material/Fade';

const Regform = ({
  onSubmit,
  errorstate,
  onChangeErrorState,
  errormsg,
  onChangeErrormsg,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  console.log(email);
  console.log(password);
  console.log(name);
  const emailfield = useRef('');

  const handleErrormsg = (state) => {
    onChangeErrormsg(state);
  };

  const handleErrorState = (state) => {
    onChangeErrorState(state);
  };

  const CheckEmail = (email) => {
    if (email === '') {
      return false;
    }

    if (!/[A-Za-z1-9.+]+@[A-Za-z1-9.+]+\.[A-Za-z]+/.test(email)) {
      return false;
    }

    return true;
  };

  const RegSubmit = (e) => {
    e.preventDefault();

    if (!CheckEmail(email)) {
      emailfield.current.value = '';
      handleErrormsg('Please enter a vaild email');
      handleErrorState(true);
      return;
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      /* eslint-disable */
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
      }),
      /* eslint-enable */
    };

    onSubmit(options);
    emailfield.current.value = '';
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className='Page-RegMain'>
      <form onSubmit={RegSubmit}>
        <Container component='main' maxWidth='xs'>
          <CssBaseline />
          <Fade
            in={errorstate}
            timeout={{ enter: 1000, exit: 3000 }}
            addEndListener={() => {
              setTimeout(() => {
                handleErrorState(false);
              }, 2000);
            }}>
            <Alert severity='error' variant='standard' className='alert'>
              <AlertTitle>Error</AlertTitle>
              {errormsg}
            </Alert>
          </Fade>
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#cbcdde',
              p: 5,
            }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon color='primary' />
            </Avatar>
            <Typography component='h1' variant='h5'>
              BigBrain
            </Typography>
            <Typography component='h1' variant='h5'>
              Sign Up
            </Typography>
            <Box noValidate sx={{ mt: 1, bgcolor: '' }}>
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                variant='filled'
                autoFocus
                inputRef={emailfield}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  input: {
                    background: '#ffffff',
                    disableUnderline: true,
                    borderColor: '#ffffff',
                  },
                }}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                id='name'
                label='Name'
                name='name'
                autoComplete='name'
                onChange={(e) => setName(e.target.value)}
                sx={{
                  input: {
                    background: '#ffffff',
                    disableUnderline: true,
                    borderColor: '#ffffff',
                  },
                }}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  input: {
                    background: '#ffffff',
                    disableUnderline: true,
                    borderColor: '#ffffff',
                  },
                }}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                name= 'sign-up'
                sx={{ mt: 3, mb: 2 }}>
                Sign Up
              </Button>
              <Grid container>
                <Grid item>
                  <Link to='/login' variant='body2' className='link'>
                    {'Already have an account? Sign In'}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </form>
    </div>
  );
};

export default Regform;
