import * as React from 'react';
import { Typography } from '@mui/material';
import { red } from '@mui/material/colors';

export default function ErrorLabel({label}){
    return(<Typography variant='caption' color={red[500]} ml={2}>{label}</Typography>);
}