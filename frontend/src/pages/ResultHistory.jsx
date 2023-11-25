import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import APIcall from '../helper';

const ResultHistory = () => {
  const { quizID } = useParams();
  const [OldSessionid, SetOldSessionid] = useState([]);
  const [QuizName, SetQuizName] = useState('');

  useEffect(async () => {
    const options = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    const data = await APIcall(options, `admin/quiz/${quizID}`);
    const quizname = data.name;
    SetQuizName(quizname);
    const OldSessionIDs = data.oldSessions;
    console.log(OldSessionIDs);
    SetOldSessionid(OldSessionIDs);
  }, []);

  return (
    <>
      <Container
        component='main'
        disableGutters
        sx={{
          m: 0,
          // maxWidth: '100vw',
          width: '100%',
          minWidth: '400px - 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'top',
          alignItems: 'center',
        }}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            minWidth: '400px - 16px',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#cbcdde',
            p: 1,
            justifyContent: 'top',
          }}>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ backgroundColor: '#cbcdde' }}>
            <Table sx={{ width: '100%', tableLayout: 'auto' }}>
              <TableHead>
                <TableRow>
                  <TableCell align='center' colSpan={5} sx={{ p: 0 }}>
                    <Typography component='h1' variant='h5' sx={{ py: 2 }}>
                      {`Recent Sessions for ${QuizName}`}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{ justifyContent: 'center', alignItems: 'center' }}>
                {OldSessionid.length > 0
                  ? (
                      <>
                        {OldSessionid.map((row) => (
                          <TableRow key={row}>
                            <TableCell sx={{ fontSize: 20, textAlign: 'center' }}>
                              <Box sx={{}}>
                                <Link to={`/dashboard/${quizID}/results/${row}`}>
                                  {row}
                                </Link>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )
                  : (
                    <TableRow>
                      <TableCell align='center' colSpan={5} sx={{ p: 0 }}>
                        <Typography component='h1' variant='h5' sx={{ py: 2 }}>
                        No Session Found
                        </Typography>
                      </TableCell>
                    </TableRow>
                    )
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </>
  );
};

export default ResultHistory;
