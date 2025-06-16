import * as React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Title = styled(Typography)(({ theme }) => ({
    fontSize: "1.2rem",
    [theme.breakpoints.up('xs')]: {
      fontSize: "1.2rem",
    },
    [theme.breakpoints.up('sm')]: {
        fontSize: "1.5rem"
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.8rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '3rem',
    },
    fontWeight: 800,
    mx: "auto",
    my: 0,
    paddingBottom: "0.3rem"
}));

export default function Index({title, bannerImage, showButton = false}){

    return(
            <div style={{ width: "100%" }}>
                <Box
                    sx={{
                        height: 360,
                        padding: 0,
                        backgroundSize: "cover",
                        backgroundImage: `url(${bannerImage})`,
                        backgroundPosition: "center center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        <Box
                            sx={{
                                textAlign: "center"
                            }}
                        >
                            <Title 
                                color="primary"
                            >{title}</Title>
                            {showButton && 
                                <Button 
                                    variant="contained" 
                                    size="lg"
                                    href="/services"
                                >
                                    EXPLORE
                                </Button>
                            }
                        </Box>
                    </Box>
                </Box>
            </div>
    );
}