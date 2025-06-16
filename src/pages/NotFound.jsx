import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Button, Container, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import data from '../mock/data.json';

const appName = data.appName

export default function NotFound(){

    return(
        <Container maxWidth='xl'>
            <Helmet>
                <title> {appName.toUpperCase()} | 404 </title>
            </Helmet>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    '& div': {
                        textAlign: 'center'
                    },
                    '& h1': {
                        fontSize: '5rem',
                        fontWeight: 700,
                        lineHeight: 1.2
                    },
                    '& p, span': {
                        fontSize: '1.75rem',
                        mb: '1rem'
                    },
                    '& .MuiTypography-subtitle1': {
                        fontSize: '1.25rem',
                        fontWeight: 300,
                        mb: '1rem'
                    }
                }}
            >
                <div>
                    <Typography component={'h1'}>404</Typography>
                    <Typography component={'p'}> <Typography component={'span'} color={'error'}>Opps!</Typography> Page not found.</Typography>
                    <Typography variant={'subtitle1'}>
                        The page you’re looking for doesn’t exist.
                    </Typography>
                    <Button variant='contained' LinkComponent={NavLink} to="/">Go TO Home</Button>
                </div>
            </Box>
        </Container>
    );
}