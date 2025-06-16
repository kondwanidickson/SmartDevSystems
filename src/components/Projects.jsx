import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Container, Link, Stack, Typography } from '@mui/material';
import { Link as IconLink } from '@mui/icons-material';
import { Title } from './index';
import data from '../mock/data.json';

const { sampleProjects } = data;

export default function Projects()
{

    return (
        <Container maxWidth="md" sx={{ height: 360, padding: '2rem', mb: 14 }}>
            <Box sx={{ textAlign: "center", width: "100%" }}>
                <Title paragraph>
                Some of our work
                </Title>
            </Box>
            <Carousel
                height={360}
                indicators={false}
                sx={{
                    borderRadius: "0.7vh",
                    boxShadow: 10
                }}
            >
                {
                    sampleProjects.map((item, i) => <Item key={i} item={item} /> )
                }
            </Carousel>
        </Container>
    )
}

function Item(props){
    return (
        <Stack
            direction={{  xs: "column-reverse", sm: "row" }}
            sx={{ height: "100%", width: "100%" }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    height: "100%",
                    width: {  xs: "100%", sm: "70%" },
                    backgroundSize: "cover",
                    backgroundImage: `url(${props.item.image})`,
                    backgroundPosition: "center center"
                }}
            >
                <Box 
                    sx={{
                        width: "4.4rem",
                        backgroundImage: `linear-gradient(
                            90deg,
                            transparent,
                            rgba(224, 224, 224, 0.35),
                            paper
                        )`,
                        mr: 0
                    }} 
                />
            </Box>
            <Box
                sx={{
                    bgcolor:  theme => theme.palette.background.paper,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: {  xs: "20%", sm: "100%" },
                    width: {  xs: "100%", sm: "30%" },
                    textAlign: "center",
                }}
            >
                {props.item.link ? 
                    <Link
                        href={props.item.link}
                        target="_blank"
                        underline="none"
                    >
                        <Typography
                            component="h3"
                            variant="h3"
                            color="primary"
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: 800,
                                mx: "auto",
                                my: 0,
                                paddingBottom: "0.3rem"
                            }}
                            gutterBottom
                        >
                            <IconLink sx={{ my: "auto" }} />{" "}{props.item.name}
                        </Typography>
                    </Link> : 
                    <Typography
                        component="h3"
                        variant="h3"
                        color="primary"
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 800,
                            mx: "auto",
                            my: 0,
                            paddingBottom: "0.3rem"
                        }}
                        gutterBottom
                    >
                        {props.item.name}
                    </Typography>
                }
            </Box>
        </Stack>
    )
}