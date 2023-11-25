import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Stack } from '@mui/system';
import { Typography } from '@mui/material';

export default function EditGameQuestion (props) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ marginBottom: 'auto' }}>
            <Typography>
                {props.question}
            </Typography>
        </CardContent>
        <CardActions>
            <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="flex-end"
                width='100%'
            >
                <IconButton color="secondary" size="large" onClick={props.editClick}>
                    <EditIcon />
                </IconButton>
                <IconButton color='secondary' aria-label="delete" size="large" onClick={props.deleteClick}>
                    <DeleteIcon />
                </IconButton>
            </Stack>
        </CardActions>
    </Card>
  );
}
