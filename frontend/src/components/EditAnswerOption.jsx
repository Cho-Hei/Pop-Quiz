import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Stack } from '@mui/system';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import theme from './Theme';

export default function EditAnswerOption (props) {
  console.log('UPDATING ANS CARDS, MY PROPS:')
  console.log(props)
  // state for checkbox
  const [correct, setCorrect] = React.useState(props.answerCorrect);
  React.useEffect(() => {
    console.log(`setting checkbox for ${props.answerText} to ${props.answerCorrect}`)
    setCorrect(props.answerCorrect)
  }, [props.answerCorrect]);
  React.useEffect(() => {
    console.log(`setting checkbox for ${props.answerText} to ${props.answerCorrect}`)
    updateAnswer();
  }, [correct]);
  const handleCorrectChange = (e) => {
    e.preventDefault();
    setCorrect(!correct);
    console.log(`setting checkbox for ${answerText} to ${!correct}`)
  }

  // state for ans text
  const [answerText, setAnswerText] = React.useState(props.answerText);
  React.useEffect(() => {
    console.log(`setting ans text: '${props.answerText}'`)
    setAnswerText(props.answerText)
  }, [props.answerText]);
  React.useEffect(() => {
    console.log(`ans text changed to: '${answerText}'`)
    updateAnswer();
  }, [answerText]);
  const handleTextChange = (e) => {
    setAnswerText(e.target.value);
  }

  // handle updates to ans
  const updateAnswer = () => {
    /* eslint-disable */
    const ans = {
      answerId: props.answerId,
      answerCorrect: correct,
      answerText: answerText,
    }
    /* eslint-enable */

    props.handleAnswerChange(ans);
  }

  return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ marginBottom: 'auto' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width='100%'
          >
              <FormControlLabel
                control={
                  <Checkbox
                    color='secondary'
                    checked={correct}
                    sx={{ color: theme.palette.secondary.main }}
                    onChange={handleCorrectChange}
                  />
                }
                label={
                  <TextField
                    variant="standard"
                    value={answerText}
                    onChange={handleTextChange}
                    color='secondary'
                    sx={{
                      input: {
                        color: theme.palette.secondary.main,
                      }
                    }}
                    error={!answerText}
                    helperText={!answerText && 'Required'}
                  />
                }
              />
                <IconButton color='secondary' aria-label="delete" size="large" onClick={props.removeAnswer}>
                    <DeleteIcon />
                </IconButton>
          </Stack>
          </CardContent>
      </Card>
  );
}
