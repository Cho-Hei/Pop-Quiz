import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StopIcon from '@mui/icons-material/Stop';
import Grid from '@mui/material/Grid';

export default function PlayGameAdmin (props) {
  // timer
  const [timeStop, setTimeStop] = React.useState();
  React.useEffect(() => {
    const endTime = new Date(props.startTime);
    const timeLimit = props.currQuestion.timeLimit;
    endTime.setSeconds(endTime.getSeconds() + timeLimit);
    setTimeStop(endTime);
  }, [props.startTime, props.currQuestion]);

  const timeLeft = () => {
    let difference = 0;
    if (timeStop) {
      const currTime = new Date();
      difference = Math.floor((timeStop.getTime() - currTime.getTime()) / 1000);
    }
    return difference;
  }

  const [timer, setTimer] = React.useState(timeLeft());
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft()]);

  return (
    <Grid
        container
        justifyContent="center"
        alignItems='center'
        width={'100%'}
        height={'100%'}
      >
        <Grid item xs={12}>
      <Stack alignItems='center' justifyContent='center' spacing={2}>
        <div>
          <Typography
            variant='h5'
            sx={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            Question {props.currQuestion.questionId} ({props.currQuestion.points} points)
          </Typography>
          <Typography
            variant='h2'
            sx={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            {props.currQuestion.questionText}
          </Typography>
        </div>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant='contained' size='large' color='tertiary' startIcon={<AccessTimeIcon />}>
            {timer >= 0 ? `${timer} secs` : 'Times up!'}
          </Button>
          <Button
            variant='contained'
            size='large'
            endIcon={<ArrowForwardIcon />}
            onClick={() => {
              props.nextQuestion();
              setTimer(0);
            }}
          >
            Next question
          </Button>
          <Button
            variant='contained'
            size='large'
            endIcon={<StopIcon />}
            onClick={props.stopGame}
          >
            Stop game
          </Button>
        </Stack>
      </Stack>
      </Grid>
    </Grid>
  );
}
