import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import APIcall from '../helper';
import AnswerOption from '../components/AnswerOption';
import Button from '@mui/material/Button';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useInterval } from 'usehooks-ts';
import { useNavigate, useLocation } from 'react-router-dom';
import SnackbarPopup from '../components/SnackbarPopup';

export default function PlayGame () {
  // snackbar
  const [snackbar, setSnackbar] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const playerName = location.state ? location.state.playername : null;
  const playerId = localStorage.getItem('playerid');
  // console.log(`player name: ${playerName}, id: ${playerId}`);

  // game status
  const [status, setStatus] = React.useState(true);
  const getStatus = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    }
    const data = await APIcall(options, `play/${playerId}/status`);
    return data;
  }
  // if status is false, game ended -> show results
  React.useEffect(() => {
    if (!status) {
      navigate(`/play/${playerId}/results`, { state: { playername: playerName } });
    }
  }, [status]);

  // fetch game data for curr session
  const getQuestion = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    }
    const data = await APIcall(options, `play/${playerId}/question`);
    return data;
  }

  // set question
  const [question, setQuestions] = React.useState({});
  useInterval(
    async () => {
      // get status
      let data = await getStatus();
      if (data.started) {
        setStatus(data.started);
        // fetcj question data
        data = await getQuestion();
        // if question id dont match, moved to new q
        if (question.questionId !== data.question.questionId) {
          setQuestions(data.question);
          console.log('new question!')
          console.log(data.question);
        }
      } else {
        setStatus(false);
      }
    },
    status ? 1000 : null
  );

  // set answer options
  const [answerOpts, setAnswerOpts] = React.useState([]);
  React.useEffect(() => {
    const answers = question.answers || [];
    answers.map((item) => {
      console.log(`question changed, setting ${item.answerId} to false`)
      item.isSelected = false;
      return item;
    });
    setAnswerOpts([...answers]);
    console.log(answers);
  }, [question]);

  // send selected answers for current question
  const sendAnswers = async () => {
    console.log('currently selected:')
    console.log(selected);
    const options = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        answerIds: selected
      }),
    }
    console.log('sending this:')
    console.log(options)
    await APIcall(options, `play/${playerId}/answer`);
    // return data;

    // add toast to show send answer was successful
    if (selected.length) {
      setSnackbar(true);
      setSnackbarText('Answer sent!');
    }
  }

  const [selected, setSelected] = React.useState([]);
  const changeAnswers = (id) => {
    if (question.answerType === 'Single choice') {
      setSelected([id]);
    } else {
      let newSelected = selected;
      if (selected.includes(id)) {
        // if ans id already in array, remove
        newSelected = selected.filter((item) => item !== id);
      } else {
        // add ans id to array
        newSelected.push(id);
      }
      setSelected([...newSelected]);
    }
  }

  // update select states for each answer option
  React.useEffect(() => {
    const answers = answerOpts;
    answers.map((item, index) => {
      item.isSelected = selected.includes(index + 1);
      console.log(`answer ${item.answerId} isSelected: ${item.isSelected}`)
      return item;
    });
    setAnswerOpts(answers);
    console.log('updated state to:')
    console.log(answers);

    console.log('selected has changed, sending...')
    sendAnswers();
  }, [selected]);

  // colours to use for answer options
  const colours = ['#CB4848', '#FF8800', '#26890C', '#1368ce', '#624CAB', '#b51963'];

  // timer
  const [timeStop, setTimeStop] = React.useState();
  React.useEffect(() => {
    const endTime = new Date(question.isoTimeLastQuestionStarted);
    // console.log(`set endTime to ${endTime}`)
    const timeLimit = question.timeLimit;
    endTime.setSeconds(endTime.getSeconds() + timeLimit);
    setTimeStop(endTime);
    // console.log(`new endTime to ${endTime}`)
  }, [question.isoTimeLastQuestionStarted]);

  // const [difference, setDifference] = React.useState(0);
  const timeLeft = () => {
    let difference = 0;
    if (timeStop) {
      const currTime = new Date();
      difference = Math.floor((timeStop.getTime() - currTime.getTime()) / 1000);
      // console.log(`difference: ${difference}, currTime: ${currTime}`)
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

  // check if answer can be submitted or not
  const [canSubmit, setCanSubmit] = React.useState(true);
  React.useEffect(() => {
    if (timer < 0) {
      setCanSubmit(false);
    }
  }, [timer]);

  // get correct answers
  const correctAnswers = async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    }
    // console.log('sending this:')
    // console.log(options)
    const data = await APIcall(options, `play/${playerId}/answer`);
    console.log('received data:')
    console.log(data)
    return data;
  }

  // if answer can't be submitted, get correct answers
  const [correct, setCorrect] = React.useState([]);
  React.useEffect(async () => {
    if (!canSubmit) {
      const res = await correctAnswers();
      const correctAns = answerOpts.filter((item) => res.answerIds.includes(item.answerId));
      correctAns.map((item) => {
        item.isSelected = false;
        return item;
      })
      console.log('correct answers:')
      console.log(correctAns);
      setCorrect([...correctAns]);
    }
  }, [canSubmit]);

  // reset states when moving to next q
  React.useEffect(async () => {
    setSelected([]);
    setCorrect([]);
    setCanSubmit(true);
  }, [question]);

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
      <Grid
        container
        justifyContent="center"
        alignItems='center'
        width={'100%'}
        height={'100%'}
      >
        <Grid item xs={12}>
          <Stack alignItems='center' justifyContent='center' spacing={2}>
            {/* <div> */}
              <Stack width={'100%'} direction={{ xs: 'column-reverse', md: 'row' }} alignItems='center' justifyContent='space-between' spacing={3}>
                <Typography
                  variant='h5'
                  sx={{ fontWeight: 'bold', textAlign: 'center' }}
                >
                  Question {question.questionId} ({question.points} points)
                </Typography>
                <Button variant='contained' color='tertiary' size='large' startIcon={<AccessTimeIcon />}>
                    {timer >= 0 ? `${timer} secs` : 'Times up!'}
                </Button>
              </Stack>
              <Typography
                variant='h2'
                sx={{ fontWeight: 'bold', textAlign: 'center' }}
              >
                {question.questionText}
              </Typography>
            {/* </div> */}
            {/* display any media here */}
            {question.mediaSrc &&
              <Card sx={{ width: '100%' }}>
                {question.mediaType === 'URL'
                  ? <CardMedia
                      component='iframe' // change to img if link is for img and add sx {objectFit: 'contain' }
                      sx={{ height: 343 }}
                      src={question.mediaSrc}
                      // image={question.mediaSrc}
                  />
                  : <CardMedia
                    sx={{ height: 343 }}
                    src={question.mediaSrc}
                    image={question.mediaSrc}
                  />
                }
              </Card>
            }
            {/* choose answers */}
            <Stack width={'100%'}>
              <Stack direction='row' alignItems='center' justifyContent='center'>
                {/* if can submit answer, show answer options */}
                {/* if can't, show correct answer */}
                <Typography
                  variant='h5'
                  sx={{ fontWeight: 'bold', textAlign: 'center' }}
                >
                  {canSubmit
                    ? question.answerType
                    : 'The correct answers were:'
                  }
                </Typography>
              </Stack>
              <Grid container spacing={1} alignItems='center' mt={0.5}>
                {!canSubmit && correct.map((ans) => (
                  <Grid item xs={12} sm={answerOpts.length === 1 ? 12 : 6} key={ans.answerId}>
                    <AnswerOption
                      answer={ans}
                      selected={true}
                      colour={colours[ans.answerId - 1]}
                      selectAnswer={() => {}}
                      isCorrect={true}
                    />
                  </Grid>
                ))}
                {/* {console.log(correct)} */}
                {canSubmit && answerOpts && answerOpts.map((ans) => (
                  <Grid item xs={12} sm={6} key={ans.answerId}>
                    <AnswerOption
                      answer={ans}
                      selected={ans.isSelected}
                      colour={colours[ans.answerId - 1]}
                      selectAnswer={() => changeAnswers(ans.answerId)}
                      isCorrect={false}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      {/* snackbar message */}
      <SnackbarPopup snackbarOpen={snackbar} snackbarText={snackbarText} />
    </>
  );
}
