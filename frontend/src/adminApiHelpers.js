import APIcall from './helper';

export const advanceGame = async (gameId) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }
  // advance game
  // console.log(`game id: ${gameId}`);
  await APIcall(options, `admin/quiz/${gameId}/advance`);
  // console.log(`advanced game with ID: ${gameId}!`);
}

export const endGame = async (gameId) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }
  // stop game
  // console.log(`game id: ${gameId}`);
  await APIcall(options, `admin/quiz/${gameId}/end`);
  // console.log(`stopped game with ID: ${gameId}!`);
}

export const getSessionStatus = async (sessionId) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }
  const data = await APIcall(options, `admin/session/${sessionId}/status`);
  return data;
}
