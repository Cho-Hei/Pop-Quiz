import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function ModalTemplate (props) {
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
                      right: 8,
                      top: 8,
                      color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                )
              : null}
        </DialogTitle>
        <DialogContent>
          {/* modal content goes here */}
        </DialogContent>
        <DialogActions>
            {/* modal btns go here */}
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button onClick={props.handleClose}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
