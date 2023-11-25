import React from 'react';
import EditGameQuestion from '../components/EditGameQuestion';
import PageHeading from '../components/PageHeading';
import EditQuestionModal from '../components/EditQuestionModal';
import { Card, Grid, Stack, Typography } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import { Link as RouterLink, useParams } from 'react-router-dom';
import APIcall from '../helper';
import { fileToDataUrl } from '../fileToDataUrl';
import SnackbarPopup from '../components/SnackbarPopup';

const placeholderImg = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

export default function EditGame () {
  const breadcrumbs = [
    <Link key="1" component={RouterLink} underline="hover" color="inherit" to={'../../dashboard'}>
      Dashboard
    </Link>,
    <Typography key="2" color="text.primary">
      Edit Game
    </Typography>,
  ];

  // snackbar
  const [snackbar, setSnackbar] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState('');

  // fetch and display game data on page
  const gameId = useParams().gameID;
  const [gameData, setGameData] = React.useState({});
  React.useEffect(() => {
    const fetchGameData = async () => {
      const options = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
      // console.log('fetching game data...');
      const data = await APIcall(options, `admin/quiz/${gameId}`);
      setGameData(data);
      console.log('question data fetched: ');
      console.log(data.questions);
      console.log('question data parsed: ');
      console.log(JSON.parse(JSON.stringify(data.questions)));
      setQuestions(data.questions);
    }
    fetchGameData();
  }, []);

  // state mainly for edit game page heading
  const [titleText, setTitleText] = React.useState('');
  React.useEffect(() => setTitleText(gameData.name), [gameData.name]);
  // handle changes in game title
  const handleTitleChange = (e) => {
    setTitleText(e.target.value);
  }

  // state mainly for game thumbnail
  const [thumbnail, setThumbnail] = React.useState(null);
  React.useEffect(() => setThumbnail(gameData.thumbnail), [gameData.thumbnail]);
  // handle changes in game thumbnail
  const handleThumbnailChange = async (e) => {
    // convert thumbnail to base64
    const newThumbnail = await fileToDataUrl(e.target.files[0]);
    setThumbnail(newThumbnail);
    // add toast to show image added
    setSnackbar(true);
    setSnackbarText('Thumbnail added!');
  }

  // state trackers to display questions
  const [questions, setQuestions] = React.useState([]);
  React.useEffect(() => {
    console.log('gameData question changed to:')
    console.log(gameData.questions)
    setQuestions(gameData.questions)
  }, [gameData.questions]);
  React.useEffect(() => {
    console.log('questions changed to:')
    console.log(questions)
  }, [questions]);
  const addQuestion = () => {
    const newQuestion = {
      questionId: questions.length + 1,
      questionText: 'Default question text',
      answerType: 'Single choice',
      timeLimit: 0,
      points: 0,
      mediaType: 'URL',
      mediaSrc: null,
      answers: [
        {
          answerId: 1,
          answerText: 'answer 1',
          answerCorrect: true,
        },
        {
          answerId: 2,
          answerText: 'answer 2',
          answerCorrect: false,
        },
      ]
    }
    setQuestions([...questions, newQuestion]);
    console.log('added new question, questions:')
    console.log([...questions, newQuestion])
  }
  const removeQuestion = (id) => {
    let res = questions.filter(q => q.questionId !== id);
    // fix id for each question
    res = res.map(elem => {
      if (elem.questionId > id) {
        elem.questionId--;
      }
      return elem;
    });

    setQuestions([...res]);
    console.log(`removed q with id: ${id}`)
    console.log('question should be changed to:')
    console.log([...res])
    // add toast to show image deleted
    setSnackbar(true);
    setSnackbarText('Question deleted!');
  }
  // handle edits to question data
  const editQuestion = (q) => {
    // remove old q from array and replace with new q
    const res = questions.map(elem => {
      console.log('curr elem:')
      console.log(elem)
      if (elem.questionId === q.questionId) {
        elem = q;
        console.log('replaced elem!')
      }
      return elem;
    });

    setQuestions([...res]);
    console.log(`edited q with id: ${q.questionId} with new data:`)
    console.log(q);
    console.log('after edit, questions should look like:')
    console.log([...res]);
  }

  // functions to open/close edit question modal
  const [open, setOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState({}); // use for populating modal with question data

  const handleClickOpen = (questionId) => {
    console.log('questions are: ')
    console.log(questions);
    const q = questions.filter((elem) => elem.questionId === questionId);
    setModalData(q[0]);
    setOpen(true);
    console.log('set modal data to:')
    console.log(q[0]);
  };
  const handleClose = () => {
    console.log('modal data before close:')
    console.log(modalData);
    setOpen(false);
    setModalData({});
  };

  // get all data on page and send to backend
  const saveGameData = async (e) => {
    e.preventDefault();
    /* eslint-disable */
    const newData = {
      questions: questions,
      name: titleText,
      thumbnail: thumbnail,
    }
    /* eslint-enable */
    const options = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newData),
    }
    // console.log('sending game data...');
    await APIcall(options, `admin/quiz/${gameId}`);
    console.log(newData);
    // show toast based on success/fail of sending data TODO
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
    <form onSubmit={saveGameData}>
      <Stack spacing={2}>
      <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
      >
          {breadcrumbs}
      </Breadcrumbs>
      </Stack>
      <PageHeading
        headingType='Edit'
        titleText={titleText}
        handleTitleChange={handleTitleChange}
        btnIcon={<SaveIcon />}
        btnText='Save Changes'
        btnAction={() => {
          // add toast to show game deleted
          setSnackbar(true);
          setSnackbarText('Saved changes to game successfully!');
        }}
      />
      <Card>
        <CardMedia
          sx={{ height: 343 }}
          image={(thumbnail && thumbnail !== ' ') ? thumbnail : placeholderImg}
        >
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-end"
            height='100%'
            zIndex={5}
          >
            <IconButton color="primary" aria-label="upload thumbnail" size="large" component="label">
              <input
                hidden
                id='upload-thumbnail'
                accept="image/jpg, image/jpeg, image/png"
                type="file"
                onChange={handleThumbnailChange} />
              <AddPhotoAlternateIcon />
            </IconButton>
            <IconButton
              color="error"
              aria-label="delete thumbnail"
              size="large"
              component="label"
              onClick={() => {
                setThumbnail(' ')
                // add toast to show image deleted
                setSnackbar(true);
                setSnackbarText('Thumbnail removed!');
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </CardMedia>
      </Card>
      <PageHeading
        titleText='Questions'
        titleVar='h3'
        titleComp='h2'
        btnIcon={<AddIcon />}
        btnText='Add Question'
        btnAction={() => {
          addQuestion();
          // add toast to show question added
          setSnackbar(true);
          setSnackbarText('Added new question!');
        }}
      />
      <Grid container spacing={2} alignItems='stretch'>
        {questions && questions.length
          ? (questions.map(q => (
              <Grid item key={q.questionId} xs={12} sm={6}>
                <EditGameQuestion
                  question={q.questionText}
                  editClick={(e) => {
                    e.preventDefault();
                    console.log(`opening edit modal, qID: ${q.questionId}`)
                    handleClickOpen(q.questionId)
                  }}
                  deleteClick={() => removeQuestion(q.questionId)}
                />
              </Grid>
            )))
          : 'No questions'
        }
      </Grid>
      {/* snackbar message */}
      <SnackbarPopup snackbarOpen={snackbar} snackbarText={snackbarText} />
      <EditQuestionModal
        open={open}
        handleClose={handleClose}
        modalData={modalData}
        editQuestion={editQuestion}
      />
    </form>
  );
}
