import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Stack } from '@mui/system';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import theme from './Theme';

export default function EditAnswerOption (props) {
  const answerText = props.answer.answerText;
  const [selected, setSelected] = React.useState(props.selected);
  React.useEffect(() => setSelected(props.selected), [props.selected])
  const colour = props.colour;
  const selectAnswer = props.selectAnswer;
  const handleSelectAnswer = (e) => {
    e.preventDefault();
    // if component not shwoing correct answer
    if (!props.isCorrect) {
      setSelected(!selected);
      selectAnswer();
    }
  }

  return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: colour }}>
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
                    checked={selected}
                    sx={{ color: theme.palette.secondary.main }}
                    onChange={handleSelectAnswer}
                  />
                }
                label={answerText}
              />
          </Stack>
          </CardContent>
      </Card>
  );
}
