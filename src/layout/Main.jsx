import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Chip, Container, Stack } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Copyright, DrawerAppBar } from '../components';

const StyledBadgeButton = styled(Box)(({ theme }) => ({
    zIndex: 999,
    right: 5,
    display: 'flex',
    cursor: 'pointer',
    position: 'fixed',
    alignItems: 'center',
    top: theme.spacing(10),
    height: theme.spacing(5),
    padding: 0,
    boxShadow: 20,
    backgroundColor: 'transparent',
    '&:hover': { opacity: 0.72, backgroundColor: 'transparent' },
    '& .MuiButton-root': { display: 'none', transition: theme.transitions.create('easeInOut')  },
    '&:hover .show-shipments-btn': { display: 'none', transition: theme.transitions.create('easeInOut')  },
    '&:hover .MuiButton-root': { 
        display: 'inline-flex', 
        transition: theme.transitions.create('easeInOut') 
    }
}));

function Main() {
    const theme = useTheme();

    return (
        <div className='wrapper'>
            <DrawerAppBar />
            <Stack 
                component="main" 
                direction="column" 
                minHeight={`calc(100vh - ${70 + Number(theme.mixins.toolbar.minHeight)}px)`}
                sx={{ 
                    // bgcolor: theme.palette.background.default,
                    background: "linear-gradient(to bottom, transparent, rgb(255, 255, 255)) rgb(240 254 255)",
                    flexGrow: 1
                }}>
                <Outlet />
            </Stack>
            {/* <StyledBadgeButton>
                <Chip label="Malawi only" variant='filled' color='warning' size='small' />
            </StyledBadgeButton> */}
            <Container
                maxWidth="xl"
                component="footer"
                sx={{
                    bgcolor: theme.palette.background.default,
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    height: 70,
                    py: [1.5, 1.5],
                }}
            >
                <Copyright sx={{ my: "auto" }} />
            </Container>
        </div>
    )
}

export default Main
