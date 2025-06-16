import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { ToastContainer, toast, Flip } from 'react-toastify';
import { Box, Button, Container, Divider, Grid, TextField, Typography, Paper, CircularProgress, Stack } from '@mui/material';
import AuthDialog from './Dialogs/AuthDialog';
import { postData, resetData } from '../config/actions';
import { fCurrency } from '../utils/formatNumber';
import data from '../mock/data.json';
import { enquire } from '../validation';
import { auth } from '../config/firebase';

const { appName, tiers } = data;

function useQueryParam(){
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
};

export default function Enquire(){
    const query = useQueryParam();
    const [user] = useAuthState(auth);
    const { service } = useParams();
    const { error, loading, data } = useSelector(state => state.api);
    const [open, setOpen] = React.useState(false);
    const [myPackage, setPackage] = React.useState(null);
    const [myServiceName, setServiceName] = React.useState("");
    const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(()=>{

        if(error){
            toast(error.message, {type: "error"});
        }

        if(data){
            toast(data.message, {type: "success"});

            setTimeout(() => {
              navigate('/app', { replace: true });
            }, 5500);
        }
    
        dispatch(resetData());
    }, [error, data, navigate, dispatch]);

    React.useEffect(() => {
      const _category = query.get('category');
  
      if (service && _category) {
        const selected_service = tiers.find(tier => tier.package.name === service);
        
        if (!selected_service) {
          navigate('/404', { replace: true });
          return;
        }
  
        setServiceName(selected_service.title);
        setPackage(selected_service);
      } else {
        navigate('/404', { replace: true });
        return;
      }
    },[query, service, navigate]);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    return(
        <Container maxWidth="sm">
            <Stack
                component={Paper}
                direction="column"
                sx={{
                    bgcolor: "#234343",
                    my: 4,
                    p: 2
                }}
            >
                <Stack direction="column" alignItems="center">
                    <Typography component="h1" variant="h4" align="center">
                        Enquire
                    </Typography>
                    <Typography component="h1" variant="caption" align="center" color="primary">
                        {appName}
                    </Typography>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" color="primary" gutterBottom>
                    {myServiceName}
                </Typography>
                <Grid container>
                    <Grid item xs={6}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }} gutterBottom>Category</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }} gutterBottom>Price</Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }} gutterBottom>{myPackage?.package?.category}</Typography>
                    <Typography variant="subtitle2" gutterBottom>
                        {"MWK " + fCurrency(myPackage?.price)}
                    </Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" color="primary" gutterBottom>
                    Enquiry Details
                </Typography>
                <Formik
                    initialValues={{
                        email: "",
                        fullname: "",
                        message: ""
                    }}
                    validationSchema={enquire}
                    onSubmit={async values => {
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        try {  
                            if (user && (!isAdmin || isAdmin === false)) {
                                dispatch(postData("/contact/enquiry-contact", {
                                    fullname: values.fullname,
                                    email: values.email, 
                                    product: myServiceName,
                                    message: values.message + "\n\nLink: " + window.location.href.replace('enquire', 'checkout')
                                }));
                            } else {
                                toast("User not authorized. Please signin first.", {type: "error"});

                                handleClickOpen();
                                return;
                            }
                        } catch (error) {
                            toast("Service enquiry failed, there might be network error.", {type: "error"});
                            // console.error(error);
                        }
                    }}
                >
                    {
                        props => {
                            const { values, errors, touched, handleChange, handleBlur, handleSubmit } = props;

                            return(
                                <Box component={Form} onSubmit={handleSubmit}>
                                    <TextField
                                        required
                                        id="fullname"
                                        name="fullname"
                                        label="Full Name"
                                        value={values.fullname}
                                        helperText={(touched.fullname && errors.fullname) && errors.fullname}
                                        error={touched.fullname && errors.fullname ? true : false}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        autoComplete="fullname"
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
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
                                    <Stack direction="row" >
                                        <Box sx={{ flexGrow: 1 }} />
                                        <Button
                                            disabled={loading}
                                            variant="contained"
                                            color="error"
                                            type="reset"
                                            sx={{ mr: 2 }}
                                        >
                                            CLEAR
                                        </Button>
                                        <Button
                                            disabled={loading}
                                            type="submit"
                                            variant="contained"
                                            startIcon={loading && <CircularProgress size={20} />}
                                        >
                                            SEND
                                        </Button>
                                    </Stack>
                                </Box>
                            );
                        }
                    }
                </Formik>
            </Stack>
            <AuthDialog open={open} handleClose={handleClose} />
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