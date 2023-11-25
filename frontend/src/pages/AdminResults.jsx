import React from 'react';
import PlayGameAdmin from '../components/PlayGameAdmin';
import DisplayAdminResult from '../components/DisplayAdminResult';
import { useNavigate, useParams } from 'react-router-dom';
import { advanceGame, endGame, getSessionStatus } from '../adminApiHelpers';
import DashboardGameModal from '../components/DashboardGameModal';

export default function AdminResults () {
  const navigate = useNavigate();
  const { quizID, sessionID } = useParams();
  // get gameId and sessionId
  const gameId = quizID;
  const sessionId = sessionID;

  // fetch game data for curr session
  const [data, setData] = React.useState({});
  React.useEffect(async () => {
    // console.log('getting session status');
    const res = await getSessionStatus(sessionId);
    // console.log(res);
    setData(res.results);
  }, []);

  // get session active status
  const [active, setActive] = React.useState(true);
  React.useEffect(() => {
    // console.log(data.questions);
    setActive(data.active);
  }, [data]);

  // set question start time
  const [startTime, setStartTime] = React.useState(null);
  React.useEffect(() => {
    // console.log(data.isoTimeLastQuestionStarted);
    setStartTime(data.isoTimeLastQuestionStarted);
  }, [data]);

  // set questions
  const [questions, setQuestions] = React.useState([]);
  React.useEffect(() => {
    // console.log(data.questions);
    setQuestions(data.questions);
  }, [data]);

  const [position, setPosition] = React.useState(0);
  React.useEffect(() => setPosition(data.position), [data]);
  const [currQuestion, setCurrQuestion] = React.useState({});
  React.useEffect(() => {
    if (questions && position < questions.length) {
      setCurrQuestion(questions[position]);
      // console.log(questions[position]);
    }
  }, [position]);

  const nextQuestion = async () => {
    await advanceGame(gameId);
    const status = await getSessionStatus(sessionId);
    setData(status.results);
  };

  const stopGame = async () => {
    await endGame(gameId);
    setOpenStopGame(true);
  };

  // handle opening and closing stop game modal
  const [openStopGame, setOpenStopGame] = React.useState(false);

  const handleStopGameClose = () => {
    setOpenStopGame(false);
    navigate('/dashboard');
  };
  // will take admin to question/results page
  const showResults = async () => {
    setOpenStopGame(false);
    const status = await getSessionStatus(sessionId);
    setData(status.results);
    // console.log('take me to results!');
  };

  return (
    <>
      {active
        ? (
        <PlayGameAdmin
          currQuestion={currQuestion}
          nextQuestion={nextQuestion}
          startTime={startTime}
          stopGame={stopGame}
        />
          )
        : (
        <DisplayAdminResult sessionActive={active} />
          )}
      {/* modal for stop game */}
      <DashboardGameModal
        open={openStopGame}
        handleClose={handleStopGameClose}
        handleLeft={handleStopGameClose}
        handleRight={showResults}
        modalTitle='Stop Game'
        modalText='Game has been stopped! Would you like to view the results of the game?'
        leftModalText='No'
        rightModalText='Yes'
      />
    </>
  );
}
