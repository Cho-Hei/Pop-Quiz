import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useParams, useNavigate } from 'react-router-dom';
import APIcall from '../helper';
import PageHeading from '../components/PageHeading';
/* eslint-disable */
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
/* eslint-enable */

const PlayerResult = () => {
  const { playerid } = useParams();
  const [haveResult, SetHaveResult] = useState(false);
  const [TimeUsedPerQuestionData, SetTimeUsedPerQuestionData] = useState([]);
  const [CorrectnessData, SetCorrectnessData] = useState('');
  const [chartText, setChartText] = useState({});
  const [FeedBack, SetFeedback] = useState([]);

  useEffect(async () => {
    const APIPlayerResult = await APIcall(null, `play/${playerid}/results`);
    CreatePlayerResult(APIPlayerResult);
  }, []);

  const CreatePlayerResult = (result) => {
    console.log(result);

    const PlayerResponse = [];

    if (result.length <= 0) {
      SetHaveResult(false);
    } else {
      const TimeUsedPerQuestion = [];
      let correct = 0;
      for (let i = 0; i < result.length; i++) {
        const question = result[i];
        if (question.correct) {
          correct += 1;
          PlayerResponse.push(true);
        } else {
          PlayerResponse.push(false);
        }

        const TimeCost = TimeDifferent(
          question.questionStartedAt,
          question.answeredAt
        );
        TimeUsedPerQuestion.push(TimeCost);
      }

      console.log(TimeUsedPerQuestion);
      console.log(correct);
      console.log(PlayerResponse);

      FindTimeUsed(TimeUsedPerQuestion);
      FindCorrectness(correct, result.length);
      SetFeedback(PlayerResponse);
      SetHaveResult(true);
    }
  };

  const FindCorrectness = (numCorrect, numQuestion) => {
    const Percentage = (numCorrect / numQuestion) * 100;
    console.log(Percentage);
    SetCorrectnessData(createDoughnutChart(Percentage));
  };

  const FindTimeUsed = (time) => {
    const chartdata = createLineChart(
      time,
      'Time used per Question (s)',
      '#fca41c'
    );
    SetTimeUsedPerQuestionData(chartdata);
  };

  const TimeDifferent = (start, end) => {
    const StartDate = new Date(start);
    const EndDate = new Date(end);
    const diff = (EndDate.getTime() - StartDate.getTime()) / 1000;
    return diff;
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

  const createDoughnutChart = (correctness) => {
    const data = {
      labels: ['Correct', 'Incorrect'],
      datasets: [
        {
          label: 'Correctness (%)',
          data: [correctness, 100 - correctness],
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 2,
        },
      ],
    };

    setChartText({
      label: (
        <Typography component='h1' variant='h5' sx={{ py: 2, marginTop: 8 }}>
          Correct
        </Typography>
      ),
      value: (
        <Typography component='h1' variant='h5' sx={{ py: 2 }}>
          {`${data.datasets[0].data[0]} %`}
        </Typography>
      ),
      // label: data.labels[0],
      // value: `${data.datasets[0].data[0]} %`,
    });

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

  const CreateOptionsDoughnut = () => {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: 90,
      tooltip: {
        callbacks: {
          label: (tooltipItem, CorrectnessData) => {
            const label =
              (CorrectnessData.datasets[tooltipItem.datasetIndex].labels &&
                CorrectnessData.datasets[tooltipItem.datasetIndex].labels[
                  tooltipItem.index
                ]) ||
              CorrectnessData.labels[tooltipItem.index] ||
              '';
            /* eslint-disable */
            setChartText({
              label: label,
              value:
                CorrectnessData.datasets[tooltipItem.datasetIndex]
                  .CorrectnessData[tooltipItem.index],
            });
            /* eslint-enable */
            return false;
          },
        },
      },
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
          text: 'Your Correctness',
          font: {
            size: 24,
          },
        },
      },
    };

    return options;
  };

  const navigate = useNavigate();

  return (
    <>
      <PageHeading
        titleText='Your Results'
        titleVar='h2'
        titleComp='h1'
        btnIcon=''
        btnText='Join another game'
        btnAction={() => navigate('/join')}
      />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box
            width={'100%'}
            height={'100%'}
              sx={{
                display: 'flex',
                minHeight: '420px',
                minWidth: 'calc(100% - 16px)',
                alignItems: 'center',
                backgroundColor: '#cbcdde',
                p: 1,
                justifyContent: 'center',
                position: 'relative',
              }}>
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
                <>
                  <Doughnut
                    data={CorrectnessData}
                    options={CreateOptionsDoughnut()}
                    style={{ zIndex: '2' }}
                  />
                  <Container
                    className='chartInner'
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      textAlign: 'center',
                      position: 'absolute',
                      zIndex: '1',
                    }}>
                    <Container className='chartLabel'>
                      {chartText.label}
                    </Container>
                    <Container className='chartValue'>
                      {chartText.value}
                    </Container>
                  </Container>
                </>
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
                  options={CreateOptions('Response Time Per Question')}
                  data={TimeUsedPerQuestionData}
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
                  <>
                    <Skeleton
                      variant='rectangular'
                      sx={{ width: '90%', height: '3rem' }}
                    />
                  </>
                  )
                : (
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ backgroundColor: '#cbcdde' }}>
                    <Table sx={{ width: '100%', tableLayout: 'auto' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell align='center' colSpan={5} sx={{ p: 0 }}>
                            <Typography component='h1' variant='h5' sx={{ py: 2 }}>
                              FeedBack
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell sx={{ width: '50%', fontSize: 20 }}>
                            Question
                          </TableCell>
                          <TableCell sx={{ width: '50%', fontSize: 20 }}>
                            Your Answer
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {FeedBack.map((row, index) => (
                          <TableRow key={index + 1}>
                            <TableCell sx={{ fontSize: 20 }}>{index + 1}</TableCell>
                            <TableCell>
                              {row
                                ? (
                                <CheckCircleIcon color='success' />
                                  )
                                : (
                                <CancelIcon color='error' />
                                  )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  )}
            </Box>
          </Grid>
        </Grid>
    </>
  );
};

export default PlayerResult;
