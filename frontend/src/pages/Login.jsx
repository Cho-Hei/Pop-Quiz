import LoginForm from '../components/Loginform';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import APIcall from '../helper';

const Login = (login) => {
  const [Errorcheck, SetErrorcheck] = useState(false);
  const [Errormsg, setErrormsg] = useState(null);
  const navigate = useNavigate();

  const onChangeErrormsg = (state) => {
    setErrormsg(state);
  };

  const onChangeErrorcheck = (state) => {
    SetErrorcheck(state);
  };

  const APILogin = async (payload) => {
    const data = await APIcall(payload, 'admin/auth/login');
    if (data.error) {
      SetErrorcheck(true);
      setErrormsg(data.error);
    } else {
      localStorage.setItem('token', data.token);
      login.updatetoken(data.token);
      navigate('/dashboard');
    }
  };

  return (
    <>
      <LoginForm
        onSubmit={(detail) => APILogin(detail)}
        Errorcheck={Errorcheck}
        onChangeErrorcheck={onChangeErrorcheck}
        Errormsg={Errormsg}
        onChangeErrormsg={onChangeErrormsg}
      />
    </>
  );
};

export default Login;
