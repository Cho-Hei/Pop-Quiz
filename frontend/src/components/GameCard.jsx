import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import HistoryIcon from '@mui/icons-material/History';
import { Box, Stack } from '@mui/system';
import { Link } from 'react-router-dom';
import APIcall from '../helper';

const placeholderImg =
  'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

export default function GameCard (props) {
  // fetch number of questions and time for game
  const fetchGameData = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    const data = await APIcall(options, `admin/quiz/${props.gameId}`);
    setGameData(data);
  };
  const [gameData, setGameData] = React.useState({});
  React.useEffect(() => {
    fetchGameData(gameData);
  }, []);

  // handle clicking on start/stop game btn
  const [gameStarted, setGameStarted] = React.useState(false);
  React.useEffect(() => {
    if (gameData.active) {
      setGameStarted(true);
    } else {
      setGameStarted(false);
    }
  }, [gameData.active]);
  const isGameStarted = (val) => {
    if (val) {
      // if game started, show stop btn
      setGameStarted(true);
      // show start game modal
      props.startGameModal();
    } else if (!val) {
      // if game not started, show start btn
      setGameStarted(false);
      // show stop game modal
      props.stopGameModal();
    }
  };

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <div>
        <CardMedia
          sx={{ height: 206 }}
          image={
            props.gameThumbnail && props.gameThumbnail !== ' '
              ? props.gameThumbnail
              : placeholderImg
          }
          title='Game thumbnail'
        />
        <CardContent>
          <Typography
            gutterBottom
            variant='h4'
            component='h2'
            fontWeight='bold'>
            {props.gameName}
          </Typography>
          <Typography variant='h5'>
            {gameData.questions
              ? `${gameData.questions.length} questions`
              : 'No questions'}
          </Typography>
          <Typography variant='h5'>
            {gameData.questions
              ? `${gameData.questions
                  .map((item) => item.timeLimit)
                  .reduce((sum, timeLimit) => sum + timeLimit, 0)} secs`
              : '0 secs'}
          </Typography>
        </CardContent>
      </div>
      <CardActions>
        <Stack
          direction={{ xs: 'row', sm: 'column', md: 'row' }}
          justifyContent='space-between'
          alignItems='center'
          spacing={2}
          width={'100%'}>
          <Box>
            <Link to={`editGame/${props.gameId}`}>
              <IconButton aria-label='edit' size='large' color='secondary'>
                <EditIcon fontSize='inherit' />
              </IconButton>
            </Link>
            <IconButton
              aria-label='delete'
              size='large'
              color='secondary'
              onClick={() => props.deleteGameModal(props.gameId)}>
              <DeleteIcon fontSize='inherit' />
            </IconButton>
          </Box>
          <Stack direction='row' spacing={1}>
            <Button
              color='inherit'
              variant='outlined'
              startIcon={<HistoryIcon />}
              onClick={() => props.viewHistory(props.gameId)}>
              History
            </Button>
            {gameStarted
              ? (
              <Button
                color='tertiary'
                variant='contained'
                startIcon={<StopIcon />}
                onClick={() => isGameStarted(false)}>
                Stop
              </Button>
                )
              : (
              <Button
                color='tertiary'
                variant='contained'
                startIcon={<PlayArrowIcon />}
                onClick={() => isGameStarted(true)}>
                Start
              </Button>
                )}
          </Stack>
        </Stack>
      </CardActions>
    </Card>
  );
}
