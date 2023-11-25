import React from 'react';
import APIcall from '../helper';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const Logout = (logout) => {
  const navigate = useNavigate();

  const APILogout = async () => {
    const payload = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    const data = await APIcall(payload, 'admin/auth/logout');
    if (data.error) {
      alert(data.error);
    } else {
      localStorage.clear();
      navigate('/');
      logout.updatetoken(null);
    }
  };
  return (
    <>
      <Button color="tertiary" variant='contained' size='large' onClick={APILogout}>Logout</Button>
    </>
  );
};

export default Logout;
