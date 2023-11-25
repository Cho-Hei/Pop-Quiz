import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import EditGame from './pages/EditGame';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import SessionJoin from './pages/SessionJoin';
import PlayerJoin from './pages/PlayerJoin';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './components/Theme';
import PlayerResult from './pages/PlayerResult';
import AdminResults from './pages/AdminResults';
import PlayGame from './pages/PlayGame';
import ResultHistory from './pages/ResultHistory';

function App () {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const updatetoken = (updatedtoken) => {
    setToken(updatedtoken);
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <header>
          </header>
          <main>
            <Routes>
              <Route path='/' element={<Main />} />
              <Route path='/login' element={token ? <Navigate to="/dashboard" /> : <Login updatetoken={updatetoken}/>} />
              <Route path='/register' element={<Register updatetoken={updatetoken}/>} />
              <Route path='/dashboard/' element={token ? <NavBar updatetoken={updatetoken} /> : <Navigate replace to="/login" />}>
                <Route path='' element={<Dashboard />} />
                <Route path='editGame/:gameID' element={<EditGame />} />
                <Route path=":quizID/results/" element={<ResultHistory />} />
                <Route path=':quizID/results/:sessionID' element={<AdminResults />} />
              </Route>
              <Route path='/join' >
                <Route index element={<SessionJoin />} />
                <Route path=':sessionid' element={<PlayerJoin />} />
              </Route>
              <Route path='/play/' element={<NavBar />}>
                <Route index element={<>You entered a secret land</>} />
                <Route path=':sessionid' element={<PlayGame />} />
                <Route path=":playerid/results" element={<PlayerResult />} />
              </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
