import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from '../components/GameCard';
import PageHeading from '../components/PageHeading';
import { Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DashboardGameModal from '../components/DashboardGameModal';
import APIcall from '../helper';
import { advanceGame } from '../adminApiHelpers';
import SnackbarPopup from '../components/SnackbarPopup';

export default function Dashboard () {
  // snackbar
  const [snackbar, setSnackbar] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState('');
  // functions to open/close start/stop/delete/create game modals
  const [openStartGame, setOpenStartGame] = React.useState(false);
  const [openStopGame, setOpenStopGame] = React.useState(false);
  const [openDeleteGame, setOpenDeleteGame] = React.useState(false);
  const [openCreateGame, setOpenCreateGame] = React.useState(false);
  const [currGame, setCurrGame] = React.useState();
  const [sessionId, setSessionId] = React.useState();
  const navigate = useNavigate();
  const startGame = async (id) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    // start game
    console.log(`game id: ${id}`);
    await APIcall(options, `admin/quiz/${id}/start`);
    const newSessionId = await getSessionId(id);
    setSessionId(newSessionId);
    console.log(`started new game with session ID: ${newSessionId}!`);
  };
  const getSessionId = async (id) => {
    // const fetchGameData = async (id) => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    console.log('fetching game data...');
    const data = await APIcall(options, `admin/quiz/${id}`);
    console.log(`backend says: ${data.active}`);
    return data.active;
    // }
    // fetchGameData(id);
  };
  // handle opening and closing start game modal
  const handleStartGameOpen = (id) => {
    setOpenStartGame(true);
    // send request to start game
    setCurrGame(id);
    startGame(id);
  };
  const handleStartGameClose = () => {
    setOpenStartGame(false);
  };

  const stopGame = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    // stop game
    console.log(`game id: ${currGame}`);
    const data = await APIcall(options, `admin/quiz/${currGame}/end`);
    // const newSessionId = await getSessionId(id);
    // setSessionId(newSessionId);
    console.log(data);
    console.log(`ended game with ID: ${currGame}!`);
  };

  // closes start game modal and open stop game modal
  const handleStopGame = async (id) => {
    setOpenStartGame(false);
    // call to api to stop game
    await stopGame(id);
    // reset currGame
    setCurrGame();
    // fetch new data
    await fetchGames();
    handleStopGameOpen();
  };
  // handle opening and closing stop game modal
  const handleStopGameOpen = () => {
    setOpenStopGame(true);
  };
  const handleStopGameClose = () => {
    setOpenStopGame(false);
  };
  // will take admin to question/results page
  const handleStartPlaying = () => {
    // setOpenStopGame(false);
    // advance to first question
    advanceGame(currGame);
    console.log('take me to results!');
  };
  // handle opening and closing delete game modal
  const handleDeleteGameOpen = (id) => {
    setCurrGame(id);
    setOpenDeleteGame(true);
  };
  const handleDeleteGameClose = () => {
    setOpenDeleteGame(false);
  };
  // handle deleting game
  const handleDeleteGame = (id) => {
    const deleteGame = async (id) => {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      console.log(`deleting game ${id}!`);
      await APIcall(options, `admin/quiz/${id}`);
      await fetchGames();
    };
    deleteGame(id);
    handleDeleteGameClose();

    // add toast to show game deleted
    setSnackbar(true);
    setSnackbarText('Deleted game successfully!');
  };
  // handle opening and closing create game modal
  const handleCreateGameOpen = () => {
    setOpenCreateGame(true);
  };
  const handleCreateGameClose = () => {
    setOpenCreateGame(false);
  };
  // handle creating game
  const handleCreateGame = (name) => {
    const createGame = async (name) => {
      const options = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        /* eslint-disable */
        body: JSON.stringify({
          name: name,
        }),
        /* eslint-enable */
      };
      console.log('creating new game!');
      await APIcall(options, 'admin/quiz/new');
      await fetchGames();
    };
    createGame(name);
    handleCreateGameClose();

    // add toast to show game created
    setSnackbar(true);
    setSnackbarText('Created game successfully!');
  };

  const handleHistory = (quizid) => {
    console.log('Quiz History for', quizid);
    navigate(`/dashboard/${quizid}/results`);
  };

  // fetch game card data from backend
  const [loadingState, setLoadingState] = React.useState(false);
  const [gamesData, setGamesData] = React.useState([]);
  const fetchGames = async () => {
    setLoadingState(true);
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    const data = await APIcall(options, 'admin/quiz');
    // console.log(data);
    data.quizzes.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      // sort by most recent quiz
      return dateB - dateA;
    });
    setGamesData(data.quizzes);
    setLoadingState(false);
  };
  React.useEffect(() => {
    fetchGames();
  }, []);

  // set snackbar state to false after 3 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSnackbarText('');
      setSnackbar(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [snackbar]);

  return (
    <>
      <PageHeading
        titleText='Dashboard'
        titleVar='h2'
        titleComp='h1'
        btnIcon={<AddIcon />}
        btnText='Create New Game'
        btnAction={handleCreateGameOpen}
      />
      <Grid container spacing={2} alignItems={'stretch'}>
        {loadingState
          ? 'Loading data'
          : gamesData.length
            ? gamesData.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} lg={4}>
                <GameCard
                  gameId={item.id}
                  gameName={item.name}
                  gameThumbnail={item.thumbnail}
                  sessionActive={item.active}
                  startGameModal={() => handleStartGameOpen(item.id)}
                  stopGameModal={() => handleStopGame(item.id)}
                  deleteGameModal={handleDeleteGameOpen}
                  viewHistory={() => handleHistory(item.id)}
                />
              </Grid>
            ))
            : 'Oops, no quizzes, create one!'}
      </Grid>
      {/* snackbar message */}
      <SnackbarPopup snackbarOpen={snackbar} snackbarText={snackbarText} />
      {/* modal for start game */}
      <DashboardGameModal
        open={openStartGame}
        handleClose={handleStartGameClose}
        handleLeft={handleStopGame}
        handleRight={handleStartPlaying}
        modalTitle='Start Game'
        modalText='Game has been started'
        gameId={currGame}
        sessionId={sessionId}
        leftModalText='Stop Game'
        rightModalText='Start Playing'
      />
      {/* modal for stop game */}
      <DashboardGameModal
        open={openStopGame}
        handleClose={handleStopGameClose}
        handleLeft={handleStopGameClose}
        handleRight={handleStartPlaying}
        modalTitle='Stop Game'
        modalText='Game has been stopped! Would you like to view the results of the game?'
        leftModalText='No'
        rightModalText='Yes'
      />
      {/* modal for delete game */}
      <DashboardGameModal
        open={openDeleteGame}
        handleClose={handleDeleteGameClose}
        handleLeft={handleDeleteGameClose}
        handleRight={handleDeleteGame}
        modalTitle='Delete Game'
        modalText='Are you sure you want to delete this game? This action cannot be undone.'
        leftModalText='Cancel'
        rightModalText='Delete'
        currGame={currGame}
      />
      {/* modal for creating new game */}
      <DashboardGameModal
        open={openCreateGame}
        handleClose={handleCreateGameClose}
        handleLeft={handleCreateGameClose}
        handleRight={handleCreateGame}
        modalTitle='Create Game'
        modalText='Please enter a title for the game'
        leftModalText='Cancel'
        rightModalText='Create Game'
      />
    </>
  );
}
