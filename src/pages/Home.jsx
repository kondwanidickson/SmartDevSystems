import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button, Card, Grid, CardContent, CardHeader, CardMedia, CardActions } from '@mui/material';
import { Title, Projects } from '../components';
import { ServiceDialog } from '../components/Dialogs';
import myImages from '../assets';
import data from '../mock/data.json';
import { auth } from '../config/firebase';

const appName = data.appName;
const offers = [
    {
        title:  "User-Friendly Interface",
        content: `Our intuitive and easy-to-navigate interface makes it effortless for you to explore and select offers that
        align with your interests and requirements. We believe in keeping things simple, so you can focus on what matters
        most—your studies.`
    },
    {
        title:  "Budget-Friendly Options",
        content: `We understand that finances can be tight during your student years. That's why we
        prioritize providing offers with significant discounts for students. Enjoy
        exploring new products and services without breaking the bank.`
    },
    {
        title:  "Reliable SMS Transactions",
        content: `Your security is our utmost priority. ${appName} ensures that all
        SMS's are protected and delivered, so you can confidently explore the api without worrying about the
        safety of your personal and financial information.`
    },
    {
        title:  "Support and Assistance",
        content: `Should you encounter any issues or have questions, We are
        always ready to assist you. We value your experience and strive to provide prompt and helpful customer support
        to ensure your journey on our platform is smooth and enjoyable.`
    },
];

const services = [
    {
        name: "api",
        title:  "SMS API's",
        content: `Our SMS APIs empower businesses to connect and engage with their customers seamlessly. Whether it's for automated notifications, marketing campaigns, or interactive messaging, our robust SMS platform ensures reliable and secure communication.`
    },
    {
        name: "development",
        title:  "Software Development",
        content: `In the realm of software development, our skilled team of experts leverages cutting-edge technologies to create tailored solutions that meet your specific requirements. From web and mobile applications to enterprise software, we strive to deliver exceptional user experiences and drive business growth.`
    },
    // {
    //     name: "hosting",
    //     title:  "Hosting",
    //     image: hosting,
    //     content: `At SmartDevSystems, we also offer reliable and scalable hosting solutions that ensure your websites and applications are always accessible and perform at their best. With a focus on security and uptime, we provide a seamless hosting experience, allowing you to focus on your core business operations.`
    // },
    // {
    //     name: "writing",
    //     title:  "Writing",
    //     image: ghostWriting,
    //     content: `At SmartDevSystems, we also offer reliable and scalable hosting solutions that ensure your websites and applications are always accessible and perform at their best. With a focus on security and uptime, we provide a seamless hosting experience, allowing you to focus on your core business operations.`
    // },
];
const { servicePricing } = data;

function useQueryParam(){
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
};

const Home = () => {
    const query = useQueryParam();
    const [user] = useAuthState(auth);
    const [open, setOpen] = React.useState(false);
    const [service, setService] = React.useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const service = query.get('service');

        if (service && service !== '') {
            const _service = services.find(s => s.name === service);

            if (_service) {
                setService({
                    ..._service,
                    ...servicePricing[_service.name]
                });
                setOpen(true);
                return;
            }

            setOpen(false);
            setService(null);
            navigate('/', { replace: true });
            return;
        } else if (service && service === '') {
            setOpen(false);
            setService(null);
            navigate('/', { replace: true });
            return;
        } else if (!service) {
            setOpen(false);
            setService(null);
            return;
        }
    },[query, navigate]);
  
    const handleClose = () => {
      setOpen(false);
      navigate('/');
    };

    return (
        <React.Fragment>
            <Helmet>
                <title> {appName.toUpperCase()} | Home </title>
            </Helmet>
            <Container maxWidth="md" sx={{ padding: '2rem' }}>
                <Box sx={{ textAlign: "center", width: "100%" }}>
                    <Title paragraph>
                        WELCOME TO SMARTDEVSYSTEMS
                    </Title>
                    
                    <Typography variant="body1" sx={{ marginBottom: '2rem' }}>
                        The ultimate online platform designed exclusively to reach your needs, hustle-free!
                    </Typography>

                    <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }} gutterBottom>
                        What We Offer:
                    </Typography>
                </Box>

                    {
                        offers.map((offer, index)=>(
                            <Typography key={index} variant="body1" sx={{ marginBottom: '1rem' }} >
                                <strong>{index + 1}. {offer.title}: </strong>{offer.content}
                            </Typography>
                        ))
                    }
            </Container>
            <Projects />
            <Container maxWidth="md" sx={{ textAlign: 'center', padding: '2rem' }}>
                <Title paragraph gutterBottom>
                OUR SERVICES
                </Title>
                
                <Typography variant="body1" sx={{ marginBottom: '2rem' }}>
                All our services are carried out to the highest standards and are offered at the most competitive rates possible. If you’re interested in a procedure not listed here, please feel free to get in touch, and we’ll discuss your options.
                </Typography>

                <Grid container spacing={3}>
                    {
                        services.map(_service=>(
                            <Grid key={_service.title} item xs={12} sm={6} md={6}>
                                <Card 
                                    raised 
                                    sx={{ 
                                        bgcolor: "#234343",
                                        height: "100%",
                                        boxShadow: 3,
                                        transition: 'transform 450ms',
                                        '&:hover': { 
                                          boxShadow: 5, 
                                          borderColor: 'neutral.outlinedHoverBorder', 
                                          transform: 'scale(1.01)' 
                                        } 
                                    }}
                                >
                                    <CardHeader
                                        title={_service.title}
                                        subheader={_service?.subheader}
                                        titleTypographyProps={{ color: theme => theme.palette.primary.main, fontSize: 20, fontWeight: 'bold' }}
                                        subheaderTypographyProps={{
                                          align: 'center',
                                        }}
                                    />
                                    <CardMedia
                                        image={myImages[_service.name]}
                                        sx={{
                                            bgcolor: "transparent",
                                            width: "100%",
                                            height: 200
                                        }}
                                    />
                                    <CardContent sx={{ minHeight: 200 }}>
                                        <Typography variant="body1" sx={{ marginBottom: '2rem' }} gutterBottom>
                                            {_service.content}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            LinkComponent={Link}
                                            fullWidth
                                            variant="contained"
                                            // to={'/home?service=' + _service?.name}
                                            to={'/services'}
                                        >
                                            Explore
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    }
                </Grid>

                {!user && 
                    <React.Fragment>
                        <br />
                        <Box sx={{ textAlign: 'center' }}>
                            <Button LinkComponent={Link} to="/auth" variant="contained" color="primary" size="large">
                            JOIN NOW
                            </Button>
                        </Box>
                    </React.Fragment>
                }
            </Container>
            <br />
            <ServiceDialog open={open} handleClose={handleClose} service={service} />
        </React.Fragment>
    );
};

export default Home;
