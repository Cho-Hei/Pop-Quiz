import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';
import EditAnswerOption from './EditAnswerOption';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { fileToDataUrl } from '../fileToDataUrl';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import SnackbarPopup from '../components/SnackbarPopup';

export default function EditQuestionModal (props) {
  // snackbar
  const [snackbar, setSnackbar] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState('');

  // states for question text
  const [questionText, setQuestionText] = React.useState('');
  React.useEffect(() => {
    setQuestionText(props.modalData.questionText)
  }, [props.modalData.questionText]);
  // handle changes in question text
  const handleQuestionTextChange = (e) => {
    setQuestionText(e.target.value);
  }

  // state for answer type
  const [answerType, setAnswerType] = React.useState(props.modalData.answerType);
  React.useEffect(() => {
    console.log(`setting answer type field to: ${props.modalData.answerType}`)
    setAnswerType(props.modalData.answerType)
  }, [props.modalData.answerType]);

  const handleAnswerTypeChange = (e) => {
    console.log(`changing ans type to: ${e.target.value}`)
    setAnswerType(e.target.value);

    // if answer type doesn't match, and new one is single choice, select first option as default
    if (answerType !== e.target.value && e.target.value === 'Single choice') {
      console.log('changing first to correct')
      const ans = answerOpt[0];
      ans.answerCorrect = true;
      handleAnswerChange(ans, e.target.value);
    }
  }

  // state for question time limit
  const [timeLimit, setTimeLimit] = React.useState(0);
  React.useEffect(() => setTimeLimit(props.modalData.timeLimit), [props.modalData.timeLimit]);
  const handleTimeLimitChange = (e) => {
    setTimeLimit(parseInt(e.target.value));
  }

  // state for question points
  const [points, setPoints] = React.useState(0);
  React.useEffect(() => setPoints(props.modalData.points), [props.modalData.points]);
  const handlePointsChange = (e) => {
    setPoints(parseInt(e.target.value));
  }

  // state for question media type
  const [mediaType, setMediaType] = React.useState(props.modalData.mediaType);
  React.useEffect(() => setMediaType(props.modalData.mediaType), [props.modalData.mediaType]);
  const handleMediaTypeChange = (e) => {
    setMediaType(e.target.value);
    // clear mediasrc
    setMediaSrc(null);
  }

  // state for question media link
  const [mediaSrc, setMediaSrc] = React.useState(null);
  React.useEffect(() => setMediaSrc(props.modalData.mediaSrc), [props.modalData.mediaSrc]);
  const handleMediaSrcChange = async (e) => {
    setMediaSrc(e.target.value);
    // if uploaded image
    if (mediaType === 'Upload' && e.target.value) {
      // convert image to base64
      const newMediaSrc = await fileToDataUrl(e.target.files[0]);
      setMediaSrc(newMediaSrc)
    // if youtube link, convert to embed link
    } else if (mediaType === 'URL') {
      // extract video id
      const videoLink = e.target.value;
      // this regex expression to extract the ID of a youtube video was taken from:
      // https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
      const youtubeRegExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const videoId = videoLink.match(youtubeRegExp)[7];
      setMediaSrc(`https://www.youtube.com/embed/${videoId}`);
    }
  }

  // show/hide add answer btn
  const [showBtn, setShowBtn] = React.useState(true);
  // number of answers to show
  const [answerOpt, setAnswerOpt] = React.useState([]);
  React.useEffect(() => {
    console.log('setting answer opts...')
    setAnswerOpt(props.modalData.answers)
  }, [props.modalData.answers]);
  const addAnswer = () => {
    // only add answer if max 6 after adding
    if (answerOpt.length < 6) {
      const newAns = {
        answerId: answerOpt.length + 1,
        answerText: `answer ${answerOpt.length + 1}`,
        answerCorrect: false,
      }
      console.log('adding new ans opt')
      setAnswerOpt([...answerOpt, newAns]);
    }
    // if 6 answers, hide button
    if (answerOpt.length + 1 >= 6) {
      setShowBtn(false);
    }
  }
  const removeAnswer = (id) => {
    // only remove answer if 2 will be left after removing
    console.log(id);
    if (answerOpt.length > 2) {
      let res = answerOpt.filter(ans => ans.answerId !== id);
      //   fix answerIds
      res = res.map(elem => {
        if (elem.answerId > id) {
          elem.answerId--;
        }
        return elem;
      });
      setAnswerOpt([...res]);
      console.log('removed answer!');
    }
    // if less than 6 answers, show button
    if (answerOpt.length - 1 < 6) {
      setShowBtn(true);
    }
  }
  // handle changes to answer options
  // ISSUE WITH SELECTING CORRECT ANSWER FOR SINGLE CHOICE TODO
  const handleAnswerChange = (ans, newAnswerType) => {
    console.log('changing ans opts')
    console.log(ans)

    // go through answer options and replace ans
    const res = answerOpt.map(elem => {
      console.log(elem.answerId, ans.answerId);
      if (elem.answerId === ans.answerId) {
        console.log(`editing ${elem.answerText}, correct status: ${elem.answerCorrect}`, elem)
        elem = ans;
      } else {
        // if answer type is single choice, update other values to be incorrect
        if (ans.answerCorrect && (answerType === 'Single choice' || newAnswerType === 'Single choice')) {
          console.log(`fixing ${elem.answerText}`)
          elem.answerCorrect = false;
        }
      }
      return elem;
    });
    console.log(`answer type is: ${answerType}`)
    console.log(res);

    setAnswerOpt([...res]);
  }

  // get all data from modal to save changes to question
  const [editedData, setEditedData] = React.useState({});
  React.useEffect(() => {
    props.editQuestion(editedData);
    console.log('saved question data!');
    console.log(editedData);
    props.handleClose();
  }, [editedData]);
  const saveQuestionData = async () => {
    const src = mediaSrc;
    /* eslint-disable */
    const q = {
      questionId: props.modalData.questionId,
      questionText: questionText,
      answerType: answerType,
      timeLimit: timeLimit,
      points: points,
      mediaType: mediaType,
      mediaSrc: src,
      answers: answerOpt,
    }
    /* eslint-enable */
    // if question text and answer text isnt empty
    if (questionText) {
      setEditedData(q);

      // add toast to show save was successful
      setSnackbar(true);
      setSnackbarText('Question edits saved, remember to save all changes!');
    }
  }

  // set snackbar state to false after 3 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSnackbarText('');
      setSnackbar(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [snackbar]);

  return (
    <div>
      <Dialog open={props.open} onClose={props.handleClose}>
        <DialogTitle>
            Edit Question
            {props.handleClose
              ? (
                <IconButton
                    aria-label="close"
                    onClick={props.handleClose}
                    sx={{
                      position: 'absolute',
                      right: 24,
                      top: 16,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                )
              : null}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Question Details:
          </DialogContentText>
          <TextField
            autoFocus
            id="question"
            label="Question"
            type="text"
            fullWidth
            multiline
            margin="normal"
            value={questionText || ''}
            error={!questionText}
            helperText={!questionText && 'Required'}
            onChange={handleQuestionTextChange}
          />
          <Grid container spacing={1} alignItems='center' justifyContent='space-between'>
            <Grid item xs={12} sm={4}>
                <TextField
                    id="select-answer-type"
                    select
                    label="Answer Type"
                    value={answerType || 'Single choice'}
                    margin="normal"
                    onChange={handleAnswerTypeChange}
                    helperText={(isNaN(timeLimit) || isNaN(points)) && ' '}
                    fullWidth
                >
                    <MenuItem key='Single choice' value='Single choice'>
                        Single choice
                    </MenuItem>
                    <MenuItem key='Multiple choice' value='Multiple choice'>
                        Multiple choice
                    </MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={6} sm={4}>
                <TextField
                  label="Time Limit (sec)"
                  id="question-time-limit"
                  margin="normal"
                  type="number"
                  value={timeLimit}
                  onChange={handleTimeLimitChange}
                  inputProps={{ min: 0 }}
                  error={isNaN(timeLimit)}
                  helperText={(isNaN(timeLimit) && 'Required') || (isNaN(points) && ' ')}
                  fullWidth
                />
            </Grid>
            <Grid item xs={6} sm={4}>
                <TextField
                  label="Points"
                  id="question-points"
                  margin="normal"
                  type="number"
                  value={points}
                  onChange={handlePointsChange}
                  inputProps={{ min: 0 }}
                  error={isNaN(points)}
                  helperText={(isNaN(points) && 'Required') || (isNaN(timeLimit) && ' ')}
                  fullWidth
                />
            </Grid>
          </Grid>
          <Grid container spacing={1} alignItems='center' justifyContent='space-between'>
            <Grid item xs={12} sm={3}>
              <TextField
                id="questionMedia"
                label="Media Type"
                variant="outlined"
                margin="normal"
                select
                value={mediaType}
                onChange={handleMediaTypeChange}
                fullWidth
              >
                <MenuItem key='URL' value='URL'>
                    URL
                </MenuItem>
                <MenuItem key='Upload' value='Upload'>
                    Upload
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={9}>
              {/* if URL, show text field, otherwise show upload input */}
              {mediaType === 'URL'
                ? (
                  <TextField
                    autoFocus
                    id="stimulus"
                    type="text"
                    fullWidth
                    margin="normal"
                    label="YouTube Link"
                    value={mediaSrc}
                    onChange={handleMediaSrcChange}
                  />
                  )
                : (
                    <Grid container spacing={1} justifyContent={{ xs: 'center', sm: 'flex-end' }}>
                      <Grid item>
                          <Button variant="contained" color='tertiary' component="label">
                            Upload
                            <input hidden accept="image/jpg, image/jpeg, image/png" type="file" onChange={handleMediaSrcChange} />
                          </Button>
                      </Grid>
                      <Grid item>
                          <Button variant="contained" color='error' component="label" onClick={() => setMediaSrc(null)}>
                            Delete
                        </Button>
                      </Grid>
                    </Grid>
                  )
              }
            </Grid>
            <Grid item xs={12}>
              {/* display question media if there is any */}
              {mediaSrc && (
                <Card sx={{ width: '100%' }}>
                  {/* check if youtube video or uploaded image */}
                  {mediaType === 'URL'
                    ? <CardMedia
                      component='iframe' // change to img if link is for img and add sx {objectFit: 'contain' }
                      sx={{ height: 343 }}
                      src={mediaSrc}
                    />
                    : <CardMedia
                      sx={{ height: 343 }}
                      src={mediaSrc}
                      image={mediaSrc}
                    />
                  }
                </Card>
              )}
            </Grid>
          </Grid>
          <DialogContentText>
            Answer Options:
          </DialogContentText>
          <Grid container spacing={1} alignItems='center'>
            {answerOpt
              ? answerOpt.map(item => (
                <Grid item xs={12} sm={6} key={item.answerId}>
                  <EditAnswerOption
                    answerId={item.answerId}
                    answerText={item.answerText}
                    removeAnswer={() => removeAnswer(item.answerId)}
                    answerCorrect={item.answerCorrect}
                    handleAnswerChange={(opt) => handleAnswerChange(opt)}
                  />
                </Grid>
              ))
              : 'No answer options'
            }
            <Grid item xs={12} sm={6}>
                {showBtn && <Button color='tertiary' variant="contained" onClick={addAnswer} fullWidth>Add an answer option</Button>}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color='inherit' onClick={props.handleClose}>Cancel</Button>
          <Button color='inherit' onClick={saveQuestionData}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* snackbar message */}
      <SnackbarPopup snackbarOpen={snackbar} snackbarText={snackbarText} />
    </div>
  );
}
