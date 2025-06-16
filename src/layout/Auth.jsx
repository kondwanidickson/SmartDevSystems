import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Fab, Container, Link, Stack, Toolbar } from '@mui/material';
import { Home } from '@mui/icons-material';

export default function Login(){

    return(
        <div className='wrapper'>
            <Stack 
                component="main" 
                direction="column" 
                sx={{ 
                    // bgcolor: theme => theme.palette.grey[300],
                    background: "linear-gradient(to bottom, transparent, rgb(255, 255, 255)) rgb(240 254 255)",
                    minHeight: "100vh"
                }}
            >
                <Container maxWidth="sm" sx={{ mb: 6 }}>
                    <Toolbar />
                    <Outlet />
                </Container>
                <AppBar
                    component={Stack}
                    direction='row-reverse'
                    alignItems='flex-end'
                    position='fixed'
                    sx={{
                        bgcolor: 'transparent',
                        backgroundImage: 'none',
                        boxShadow: 'none',
                        height: 'fit-content',
                        p: 0,
                        top: 'auto',
                        bottom: 10,
                    }}
                >
                    <Fab 
                        LinkComponent={Link}
                        color="primary" 
                        href="/"
                        sx={{ mr: 2 }}
                    >
                        <Home />
                    </Fab>
                </AppBar>
            </Stack>
        </div>
    );
}