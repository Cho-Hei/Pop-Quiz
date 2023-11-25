import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import APIcall from '../helper';
import GameJoin from '../components/GameJoin';
import WaitingLobby from '../components/WaitingLobby';
import { useInterval } from 'usehooks-ts';

const PlayerJoin = () => {
  const [sessionactive, SetSessionActive] = useState(false);
  const [sessionerror, SetSessionError] = useState(false);
  const [sessionerrormsg, SetSessionErrormsg] = useState('');
  const [sessiononwait, SetSessionOnWait] = useState(false);
  const [hasEntername, SetHasEntername] = useState(false);
  const [sessionEnd, SetSessionEnd] = useState(false);

  const [namepayload, SetNamePayload] = useState([]);
  // const [playerid, SetPlayerId] = useState('');
  const [playername, SetPlayerName] = useState('');

  const { sessionid } = useParams();
  console.log(sessionid);

  const navigate = useNavigate();

  const onChangeSessionError = (state) => {
    SetSessionError(state);
  };

  const onChangeSessionErrormsg = (state) => {
    SetSessionErrormsg(state);
  };

  const onChangeSessionEnd = (state) => {
    SetSessionEnd(state);
  };

  const APIJoinGame = async (payload, name) => {
    SetPlayerName(name);
    SetNamePayload(payload);
    SetHasEntername(true);
    const data = await APIcall(payload, `play/join/${sessionid}`);
    if (data.error) {
      SetSessionActive(false);
      SetSessionError(true);
      SetSessionErrormsg(data.error);
    } else {
      const playerid = data.playerId;
      localStorage.setItem('playerid', playerid);
      const SessionStatus = await APIcall(null, `play/${playerid}/status`);
      if (SessionStatus.started) {
        SetSessionActive(true);
        SetSessionOnWait(false);
        navigate(`/play/${sessionid}`, { state: { playername: name } });
      } else {
        SetSessionActive(true);
        SetSessionOnWait(true);
      }
    }

    return data;
  };

  useInterval(
    async () => {
      console.log('Checking if session active');
      const data = await APIcall(namepayload, `play/join/${sessionid}`);
      localStorage.setItem('playerid', data.playerId);
      if (data.error) {
        SetSessionActive(false);
      } else {
        SetSessionActive(true);
      }
    },
    !sessionactive && hasEntername ? 1000 : null
  );

  useInterval(
    async () => {
      console.log('Checking if session onWait');
      const playerid = localStorage.getItem('playerid');
      const data = await APIcall(null, `play/${playerid}/status`);
      if (data.started) {
        SetSessionOnWait(false);
        // eslint-disable-next-line
        navigate(`/play/${sessionid}`, { state: { playername: playername } });
      } else if (data.error) {
        SetSessionOnWait(false);
        SetSessionEnd(true);
      } else {
        SetSessionOnWait(true);
      }
    },
    sessiononwait && hasEntername && sessionactive ? 1000 : null
  );

  return (
    <>
      {sessiononwait
        ? (
        <WaitingLobby />
          )
        : (
        <GameJoin
          onJoin={(options, name) => APIJoinGame(options, name)}
          sessionerror={sessionerror}
          onChangeSessionError={onChangeSessionError}
          sessionerrormsg={sessionerrormsg}
          onChangeSessionErrormsg={onChangeSessionErrormsg}
          sessionEnd={sessionEnd}
          onChangeSessionEnd={onChangeSessionEnd}
        />
          )}
    </>
  );
};

export default PlayerJoin;
