import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import myImages from '../assets';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Button, Box, Typography } from '@mui/material';
import { Title } from '../components';
import data from '../mock/data.json';

// ----------------------------------------------------------------------

const appName = data.appName
const StyledContent = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    color: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: `url(${myImages.banner})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    padding: 0,
    minWidth: '100%',
    minHeight: "100vh",
    margin: 'auto',
    textAlign: 'center',
}));

// ----------------------------------------------------------------------

export default function GetStarted() {
    const theme = useTheme();
    localStorage.setItem('hasViewedGetStarted', true);

    return (
        <>
        <Helmet>
            <title> {appName.toUpperCase()} | Get started </title>
        </Helmet>

            <StyledContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "60%"
                    }}
                >
                    <Box
                        sx={{
                            textAlign: "center"
                        }}
                    >
                        <Title paragraph>
                        {appName.toUpperCase()}
                        </Title>

                        <Typography color={theme.palette.grey[400]} gutterBottom>
                        Empowering Technology Solutions for Your Success!
                        </Typography>
                        <br />

                        <Button to="/" size="large" variant="contained" component={RouterLink}>
                            GET STARTED
                        </Button>
                    </Box>
                </Box>
            </StyledContent>
        </>
    );
}
