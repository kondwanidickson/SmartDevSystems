import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import PaymentForm from './PaymentForm';
import data from '../../../mock/data.json';

const { appName } = data;

export default function Index() {

  return (
        <React.Fragment>
            <Box component={Paper} variant="outlined" sx={{ boxShadow: 2, my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Typography component="h1" variant="h4" align="center">
                    Checkout
                </Typography>
                <Typography component="h1" variant="caption" align="center" color="primary">
                    {appName}
                </Typography>
                <PaymentForm />
            </Box>
        </React.Fragment>
    );
}