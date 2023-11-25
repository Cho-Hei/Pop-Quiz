import {
  Box,
  Breadcrumbs,
  Grid,
  Skeleton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Stack,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import React, { useEffect, useState } from 'react';
/* eslint-disable */
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Chart } from 'react-chartjs-2';
/* eslint-enable */
import APIcall from '../helper';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { getSessionStatus } from '../adminApiHelpers';
import { useInterval } from 'usehooks-ts';
import PageHeading from './PageHeading';

const DisplayAdminResult = () => {
  const { quizID, sessionID } = useParams();
  const [haveResult, SetHaveResult] = useState(false);
  const [QuizTitle, SetQuizTitle] = useState('');
  const [TopFive, SetTopFive] = useState([]);
  const [AvgTimePerquestion, SetAvgTimePerquestion] = useState({});
  const [CorrectnessData, SetCorrectnessData] = useState({});
  const [noresult, SetNoResult] = useState(false);

  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(true);
  useInterval(
    async () => {
      console.log(`checking game status, isActive: ${isActive}`);
      const data = await getSessionStatus(sessionID);
      if (data.results) {
        console.log(`game status, isActive: ${data.results.active}`);
        setIsActive(data.results.active);
      } else {
        console.log('game still running, try again later');
        setIsActive(true);
      }
    },
    isActive ? 1000 : null
  );

  useEffect(async () => {
    if (!isActive) {
      console.log('getting results of game...');
      const options = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };
      const APIQuizResult = await APIcall(
        options,
        `admin/session/${sessionID}/results`
      );
      console.log(quizID);
      const APIQuizDetail = await APIcall(options, `admin/quiz/${quizID}`);
      SetQuizTitle(APIQuizDetail.name);
      CreateResult(APIQuizResult.results, APIQuizDetail);
    }
  }, [isActive]);

  const CreateResult = (result, quiz) => {
    console.log(result);
    console.log(quiz);

    if (result.length <= 0) {
      SetHaveResult(false);
      SetNoResult(true);
    } else {
      const PlayerScore = new Map();
      const AvgTime = [];
      const CorrectPercentage = [];
      for (let i = 0; i < quiz.questions.length; i++) {
        let TimeTotal = 0;
        let users = 0;
        let correctness = 0;
        result.forEach((user, index) => {
          const question = user.answers[i];
          if (question.correct) {
            const score = quiz.questions[i].points;
            const updatescore = (PlayerScore.get(index) || 0) + score;
            PlayerScore.set(index, updatescore);
            correctness += 1;
          } else {
            const updatescore = (PlayerScore.get(index) || 0) + 0;
            PlayerScore.set(index, updatescore);
          }

          TimeTotal += TimeDifferent(
            question.questionStartedAt,
            question.answeredAt
          );
          users += 1;
        });

        AvgTime.push(FindAvgTime(TimeTotal, users));
        CorrectPercentage.push(FindCorrectPercentage(correctness, users));
      }

      console.log(PlayerScore);
      console.log(AvgTime);
      console.log(CorrectPercentage);
      FindTopFive(PlayerScore, result);
      FindAvgTimePerQuestion(AvgTime);
      FindCorrectness(CorrectPercentage);
      SetHaveResult(true);
    }
  };

  const TimeDifferent = (start, end) => {
    const StartDate = new Date(start);
    const EndDate = new Date(end);
    const diff = (EndDate.getTime() - StartDate.getTime()) / 1000;
    return diff;
  };

  const FindAvgTime = (time, users) => {
    return time / users;
  };

  const FindCorrectPercentage = (correctness, users) => {
    return (correctness / users) * 100;
  };

  const FindTopFive = (map, res) => {
    const TopFive = new Map([...map].sort((a, b) => b[1] - a[1]).slice(0, 5));
    console.log(TopFive);

    const TopFivePlayers = [];

    TopFive.forEach((score, player) => {
      console.log(player, score);
      /* eslint-disable */
      const detail = {
        user: res[player].name,
        score: score,
      };
      /* eslint-enable */
      TopFivePlayers.push(detail);
    });

    console.log(TopFivePlayers);
    SetTopFive(TopFivePlayers);
  };

  const FindAvgTimePerQuestion = (avgtime) => {
    const chartdata = createLineChart(
      avgtime,
      'Average Response Time (s)',
      '#8e57e6'
    );
    SetAvgTimePerquestion(chartdata);
  };

  const FindCorrectness = (correctness) => {
    const chartdata = createLineChart(
      correctness,
      'Correctness (%)',
      '#fca41c'
    );
    SetCorrectnessData(chartdata);
  };

  const createLineChart = (recivedata, cuslabel, colour) => {
    console.log(recivedata);
    const data = {
      labels: CreateLabels(recivedata),
      datasets: [
        {
          label: cuslabel,
          data: recivedata,
          backgroundColor: colour,
          barPercentage: 0.65,
        },
      ],
    };

    return data;
  };

  const CreateLabels = (data) => {
    console.log(data);
    const labels = [];
    for (const i in data) {
      const q = parseInt(i) + 1;
      labels.push(`Question ${q}`);
    }
    return labels;
  };

  const CreateOptions = (title) => {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 18,
            },
          },
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 24,
          },
        },
      },
    };

    return options;
  };

  const BacktoDashBoard = () => {
    navigate('/dashboard');
  };

  const breadcrumbs = [
    <Link
      key='1'
      component={RouterLink}
      underline='hover'
      color='inherit'
      to={'../../dashboard'}>
      Dashboard
    </Link>,
    <Typography key='2' color='text.primary'>
      {QuizTitle}
    </Typography>,
  ];

  return (
    <>
      <Stack spacing={2}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize='small' />}
          aria-label='breadcrumb'>
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
      <PageHeading
        titleText='Results'
        titleVar='h2'
        titleComp='h1'
        btnIcon=''
        btnText='Return to Dashboard'
        btnAction={BacktoDashBoard}
      />
      {noresult
        ? (
        <>
          <Grid
            item
            container
            // maxWidth='80%'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'wrap',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Typography component='h1' variant='h4' sx={{ my: 2 }}>
              Result not available, Please come back later
            </Typography>
          </Grid>
        </>
          )
        : (
        <>
          <Grid
            container
            spacing={2}
          >
            <Grid item xs={12} md={6}>
              <Box
                width={'100%'}
                height={'100%'}
                sx={{
                  backgroundColor: '#cbcdde',
                  p: 1,
                }}
              >
                {!haveResult
                  ? (
                  <>
                    <Skeleton
                      variant='circular'
                      width={50}
                      height={50}
                      sx={{ m: 1 }}
                    />
                    <Skeleton
                      variant='circular'
                      width={50}
                      height={50}
                      sx={{ m: 1 }}
                    />
                    <Skeleton
                      variant='circular'
                      width={50}
                      height={50}
                      sx={{ m: 1 }}
                    />
                  </>
                    )
                  : (
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ backgroundColor: '#cbcdde' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            align='center'
                            colSpan={5}
                            sx={{ p: 0 }}>
                            <Typography
                              component='h1'
                              variant='h5'
                              sx={{ p: 0 }}>
                              Leaderboard
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Position</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {TopFive.map((row, index) => (
                          <TableRow key={index + 1}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.user}</TableCell>
                            <TableCell>{row.score}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                    )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                width={'100%'}
                height={'100%'}
                sx={{
                  backgroundColor: '#cbcdde',
                  p: 1,
                }}
              >
                {!haveResult
                  ? (
                  <Skeleton
                    variant='rectangular'
                    sx={{ width: '90%', height: '3rem' }}
                  />
                    )
                  : (
                  <Bar
                    options={CreateOptions('Student Correctness')}
                    data={CorrectnessData}
                    style={{ width: '100%', height: '100%' }}
                  />
                    )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                width={'100%'}
                height={'100%'}
                sx={{
                  backgroundColor: '#cbcdde',
                  p: 1,
                }}
              >
                {!haveResult
                  ? (
                  <Skeleton
                    variant='rectangular'
                    sx={{ width: '90%', height: '3rem' }}
                  />
                    )
                  : (
                  <Bar
                    options={CreateOptions('Average Response Time')}
                    data={AvgTimePerquestion}
                    style={{ width: '100%', height: '100%' }}
                  />
                    )}
              </Box>
            </Grid>
          </Grid>
        </>
          )}
    </>
  );
};

export default DisplayAdminResult;
