import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import APIcall from '../helper';
import Regform from '../components/Regform';
const Register = (reg) => {
  const [errorstate, setErrorState] = useState(false);
  const [errormsg, setErrormsg] = useState('');
  const navigate = useNavigate();

  const onChangeErrorState = (state) => {
    setErrorState(state);
  };

  const onChangeErrormsg = (state) => {
    setErrormsg(state);
  };

  const APIReg = async (payload) => {
    const data = await APIcall(payload, 'admin/auth/register');
    if (data.error) {
      setErrorState(true);
      setErrormsg(data.error);
    } else {
      localStorage.setItem('token', data.token);
      reg.updatetoken(data.token);
      navigate('/dashboard');
    }
  };

  return (
    <Regform
      onSubmit={(detail) => APIReg(detail)}
      errorstate={errorstate}
      onChangeErrorState={onChangeErrorState}
      errormsg={errormsg}
      onChangeErrormsg={onChangeErrormsg}
    />
  );
};

export default Register;
