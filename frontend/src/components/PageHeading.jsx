
import React from 'react';
import { Button, Stack, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';

export default function PageHeading (props) {
  // state mainly for edit game page heading
  // const [titleText, setTitleText] = React.useState('');
  // React.useEffect(() => props.handleTitleChange(props.titleText), [props.titleText]);
  // React.useEffect(props.handleTitleChange, [props.titleText]);
  // onChange={(e) => props.handleTitleChange(e.target.value)}

  return (
    <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        width='100%'
        pt='10px'
        pb='10px'
    >
        {props.headingType
          ? <TextField
                id="edit-game-title"
                variant="standard"
                label="Game Name"
                value={props.titleText || ''}
                onChange={props.handleTitleChange}
                inputProps={{
                  style: {
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    lineHeight: '1',
                  }
                }}
                multiline
                fullWidth
            />
          : <Typography
                variant={props.titleVar}
                component={props.titleComp}
                sx={{ fontWeight: 'bold' }}
            >
                {props.titleText}
            </Typography>
        }
        <Button
            size='large'
            variant='contained'
            startIcon={props.btnIcon}
            color='tertiary'
            onClick={() => props.btnAction()}
            type={props.headingType ? 'submit' : ''}
        >
            {props.btnText}
        </Button>
    </Stack>
  );
}
