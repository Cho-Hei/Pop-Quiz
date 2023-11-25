import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert (props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackbarPopup (props) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setOpen(props.snackbarOpen)
    console.log(`snack state changed to ${props.snackbarOpen}`);
  }, [props.snackbarOpen])
  const [snackbarText, setSnackbarText] = React.useState('');
  React.useEffect(() => {
    setSnackbarText(props.snackbarText)
    console.log(`snack text changed to ${props.snackbarText}`);
  }, [props.snackbarText])

  return (
    <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity="success" sx={{ width: '100%' }}>
        {snackbarText}
      </Alert>
    </Snackbar>
  );
}
