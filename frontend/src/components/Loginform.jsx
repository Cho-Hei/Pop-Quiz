import React, { useRef, useState } from 'react';
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
import { Link } from 'react-router-dom';

const LoginForm = ({
  onSubmit,
  Errorcheck,
  onChangeErrorcheck,
  Errormsg,
  onChangeErrormsg,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  console.log(email);
  console.log(password);
  const emailfield = useRef('');
  const passwordfield = useRef('');

  const handleErrormsg = (state) => {
    onChangeErrormsg(state);
  };

  const handleErrorcheck = (state) => {
    onChangeErrorcheck(state);
  };

  const LoginSubmit = (e) => {
    e.preventDefault();

    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      /* eslint-disable */
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      /* eslint-enable */
    };

    onSubmit(options);
    emailfield.current.value = '';
    passwordfield.current.value = '';
    setEmail('');
    setPassword('');
  };
  return (
    <div className='Page-LoginMain'>
      <form onSubmit={LoginSubmit}>
        <Container component='main' maxWidth='xs'>
          <CssBaseline />
          <Fade
            in={Errorcheck}
            timeout={{ enter: 1000, exit: 2000 }}
            addEndListener={() => {
              setTimeout(() => {
                handleErrorcheck(false);
                handleErrormsg(null);
              }, 1000);
            }}>
            <Alert severity='error' variant='standard' className='alert'>
              <AlertTitle>Error</AlertTitle>
              {Errormsg}
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
              Sign In
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
                inputRef={emailfield}
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  input: {
                    background: '#ffffff',
                    disableUnderline: true,
                    borderRadius: '10px',
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
                variant='filled'
                autoComplete='current-password'
                inputRef={passwordfield}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  input: {
                    background: '#ffffff',
                    disableUnderline: true,
                    borderRadius: '10px',
                    borderColor: '#ffffff',
                  },
                }}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                name='sign-in'
                sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link to='/register' variant='body2' className='link'>
                    {"Don't have an account? Sign Up"}
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

export default LoginForm;
