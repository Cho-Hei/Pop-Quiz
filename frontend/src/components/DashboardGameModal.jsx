import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

export default function DashboardGameModal (props) {
  const [newGameTitle, setNewGameTitle] = React.useState('');

  const handleRightBtn = () => {
    if (props.modalTitle === 'Create Game') {
      props.handleRight(newGameTitle);
    } else {
      props.handleRight(props.currGame);
    }
  }

  const handleLeftBtn = () => {
    if (props.modalTitle === 'Start Game') {
      props.handleLeft(props.currGame);
    } else {
      props.handleLeft();
    }
  }

  return (
    <div>
      <Dialog open={props.open} onClose={props.handleClose}>
        <DialogTitle>
            {props.modalTitle}
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
          <DialogContentText component='div' textAlign={'center'}>
            <Typography component='div' mb={1}>
                {props.modalText}
            </Typography>
                {props.sessionId &&
                  <Stack direction='row' alignItems='center' spacing={1} mt={1}>
                    <Typography component='span'>
                        Session ID:
                    </Typography>
                    <TextField
                      id="session-id"
                      defaultValue={props.sessionId}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="start">
                            <ContentPasteIcon />
                          </InputAdornment>
                        )
                      }}
                      onClick={() => {
                        const baseURL = window.location.href.replace(window.location.pathname, '');
                        navigator.clipboard.writeText(`${baseURL}/join/${props.sessionId}`)
                      }}
                      sx={{ input: { cursor: 'pointer' } }}
                    />
                  </Stack>
                }
                {props.modalTitle === 'Create Game' &&
                    <TextField
                      id="new-game-title"
                      label="Game Title"
                      variant="outlined"
                      onChange={(e) => setNewGameTitle(e.target.value)}
                      fullWidth
                    />
                }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='inherit' onClick={handleLeftBtn}>{props.leftModalText}</Button>
          {props.rightModalText === 'Start Playing'
            ? <Link
                color='inherit'
                component={RouterLink}
                to={`${props.gameId}/results/${props.sessionId}`}
                state={{ gameId: props.gameId, sessionId: props.sessionId }}
                onClick={handleRightBtn}
              >
              <Button color='inherit'>{props.rightModalText}</Button>
            </Link>
            : <Button color={props.rightModalText === 'Delete' ? 'error' : 'inherit'} onClick={handleRightBtn}>{props.rightModalText}</Button>
          }
        </DialogActions>
      </Dialog>
    </div>
  );
}
