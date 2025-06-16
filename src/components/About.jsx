import * as React from 'react';
import { Box, Container, Typography } from '@mui/material';
import data from '../mock/data.json';

const appName = data.appName;

export default function About(){

    return(
        <Box
            sx={{
                minHeight: 360,
                p: 0,
                // px: 2
            }}
        >
            <Container
                maxWidth="md"
                sx={{ minHeight: 360, my: 2 }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <Box sx={{ width: "100%", textAlign: "center" }} >
                        <Typography 
                            color="primary.light"
                            style={{
                                fontSize: "1.8rem",
                                fontWeight: 800,
                                mx: "auto",
                                my: 0,
                                paddingBottom: "0.3rem"
                            }}
                            gutterBottom
                        >
                            About {' '}{appName}
                        </Typography>
                        <Typography 
                            variant="body1"
                            color="#FFFFFF"
                            style={{
                                lineHeight: 1.3,
                                paddingTop: "0.5rem",
                                fontSize: "1.2rem",
                                mx: "auto",
                                my: 0,
                            }}
                            gutterBottom
                        >
                            Welcome to SmartDevSystems! We're your partners for seamless customer engagement via SMS APIs. Our experts create tailored solutions using the latest tech, delivering exceptional user experiences. Count on us for reliable services, ensuring top-performing websites and applications with a focus on security. Trust SmartDevSystems for innovative SMS and software development services that drive your success.
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}