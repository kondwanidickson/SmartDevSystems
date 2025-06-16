import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AppBar, Fab, Container, Link, Stack } from '@mui/material';
import { Apps, Home } from '@mui/icons-material';
import { auth } from '../config/firebase';

export default function Checkout(){
    const [user, loading] = useAuthState(auth);

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
                        // color="primary" 
                        href={user ? (loading ? "/" : "/app") : "/"}
                        sx={{ 
                            bgcolor: "#234343", 
                            color: "#FFFFFF", 
                            mr: 2,
                            "&:hover": {
                                bgcolor: "#234343D9"
                            }
                        }}
                    >
                        {user ? (loading ? <Home /> : <Apps />) : <Home />}
                    </Fab>
                </AppBar>
            </Stack>
        </div>
    );
}