import * as React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Formik, Form } from 'formik';
import { ToastContainer, toast, Flip } from 'react-toastify';
import { Avatar, Box, Button, Container, Grid, Link, TextField, Typography, Paper, Stack, CircularProgress } from '@mui/material';
import { Support } from '@mui/icons-material';

import { postData, resetData } from '../config/actions';
import { contactUS } from '../validation';

export default function Contact(){
    const { data, error, loading } = useSelector(state => state.api);
    const dispatch = useDispatch();

    React.useEffect(()=>{

        if(error){
            toast(error.message, {type: error.type});
            return;
        }

        if(data){
            toast(data.message, {type: data.type});
            return;
        }
    
        dispatch(resetData());
    }, [error, data, dispatch]);

    return(
        <Container maxWidth="md">
            <Grid component={Paper} container sx={{ boxShadow: 3, my: 4 }}>
                <Grid item xs={12} sm={6} md={6}>
                    <Stack
                        direction="column"
                        alignItems={"center"}
                        justifyContent={"center"}
                        sx={{ 
                            // bgcolor: theme => theme.palette.grey[200], 
                            height: "100%"
                        }}
                    >
                        <Avatar sx={{ my: 1, mx: "auto", bgcolor: 'secondary.main' }}>
                            <Support />
                        </Avatar>
                        <Box sx={{ textAlign: "center" }} >
                            <Typography 
                                color="primary"
                                component="h5"
                                variant="h3"
                                gutterBottom
                            >Contact US</Typography>
                            <Typography 
                                component="h4"
                                variant="body"
                                color="#FFFFFF"
                            >
                                Need to get in touch with us? Either fill out the form with your inquiry or contact us using the following emails: {' '}
                                <Link href="mailto:info@smartdevsystems.com">info@smartdevsystems.com</Link> or{' '}
                                <Link href="mailto:sales@smartdevsystems.com">sales@smartdevsystems.com</Link>
                            </Typography>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 2
                        }}
                    >
                        <Formik
                            initialValues={{
                                fullname: "",
                                email: "",
                                message: ""
                            }}
                            validationSchema={contactUS}
                            onSubmit={async values => {
                                await new Promise(resolve => setTimeout(resolve, 500));

                                try {                
                                    dispatch(postData("/contact/sales-contact/", values));
                                } catch (error) {
                                    toast("Message sending failed, there might be network error.", {type: "error"});
                                    console.error(error);
                                }
                            }}
                        >
                            {
                                props => {
                                    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = props;

                                    return(
                                        <Box component={Form} onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="fullname"
                                                label="Fullname"
                                                name="fullname"
                                                autoComplete="fullname"
                                                value={values.fullname}
                                                helperText={(touched.fullname && errors.fullname) && errors.fullname}
                                                error={touched.fullname && errors.fullname ? true : false}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="email"
                                                label="Email"
                                                name="email"
                                                autoComplete="email"
                                                value={values.email}
                                                helperText={(touched.email && errors.email) && errors.email}
                                                error={touched.email && errors.email ? true : false}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                multiline
                                                minRows={7}
                                                name="message"
                                                label="Message"
                                                id="message"
                                                autoComplete="message"
                                                value={values.message}
                                                helperText={(touched.message && errors.message) && errors.message}
                                                error={touched.message && errors.message ? true : false}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <Button
                                                disabled={loading}
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                startIcon={loading && <CircularProgress size={20} />}
                                                sx={{ mt: 3, mb: 2 }}
                                            >
                                            Send Message
                                            </Button>
                                        </Box>
                                    );
                                }
                            }
                        </Formik>
                    </Box>
                </Grid>
            </Grid>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                transition={Flip}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </Container>
    );
}