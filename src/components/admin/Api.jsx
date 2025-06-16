import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, gql } from '@apollo/client';
import { ToastContainer, toast, Flip } from 'react-toastify';
import { Formik, Form } from 'formik';
import { Autocomplete, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, Grid, TextField } from '@mui/material';
import { newApi } from '../../validation';
import { postData, resetAll } from '../../config/actions';

const getUsers = gql`
  query UsersQuery(
    $id: String
    $email: String
  ) {
    users(
      id: $id
      email: $email
    ) {
      id
      email
    }
  }
`;

export default function Api(){
    const { loading, error, data } = useQuery(getUsers, { variables: {} });
    const selector = useSelector(state => state.api);
    let [users, setUsers] = React.useState([]);
    const dispatch = useDispatch();

    const updateUsers = React.useCallback(() => {
        if (data && data.users) {
            setUsers(data?.users?.filter(user => user.email !== null));
        }
    },[data]);

    React.useEffect(()=>{
      if(selector.error){
        toast(selector.error.message, {type: "error"});
        return;
      }
      
      if(selector.data){
        toast(selector.data.message, {type: "success"});
        return;
      }

      if (error) {
          console.log({error});
      }

      updateUsers();
      dispatch(resetAll());
    }, [selector.data, error, selector.error, updateUsers, dispatch]);

    return(
        <React.Fragment>
            <Container maxWidth="sm" sx={{ my: 4 }}>
                <Formik
                    initialValues={{
                        email: "",
                        apikey: "",
                        scrtkey: ""
                    }}
                    validationSchema={newApi}
                    onSubmit={async values => {
                        await new Promise(resolve => setTimeout(resolve, 500));

                        const clientUid = users.find(user => user.email === values.email).id;
                        const apiKey = values.apikey;
                        const scrtKey = values.scrtkey;

                        if (clientUid === '' || apiKey === '' || scrtKey === '') {
                            toast('Input fields can not be empty', {type: "error"});
                            return
                        }

                        dispatch(postData("/apis/create-api", {
                            clientUid: users.find(user => user.email === values.email).id,
                            apiKey,
                            scrtKey
                        }));
                    }}
                >
                    {
                        props => {
                            const { values, errors, touched, handleChange, handleBlur, handleSubmit } = props;

                            return (
                                <Card component={Form} onSubmit={handleSubmit}>
                                    <CardHeader title={"New API Key"} sx={{ color:  theme => theme.palette.primary.main }} />
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Autocomplete
                                                    disablePortal
                                                    disabled={loading && !data?.users === undefined}
                                                    id="email"
                                                    options={users.length === 0 ? users : users.map(user => user.email)}
                                                    sx={{ width: '100%' }}
                                                    onChange={(event, newValue) => {
                                                        handleChange({
                                                            ...event,
                                                            target: {
                                                                name: 'email',
                                                                value: newValue
                                                            }
                                                        });
                                                    }}
                                                    renderInput={(params) => 
                                                        <TextField 
                                                            {...params}
                                                            required
                                                            margin="normal" 
                                                            fullWidth 
                                                            name="email" 
                                                            label="User Email"
                                                            onBlur={handleBlur}
                                                            helperText={(touched.email && errors.email) && errors.email}
                                                            error={touched.email && errors.email ? true : false}
                                                        />
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField 
                                                    required
                                                    margin="normal" 
                                                    fullWidth 
                                                    name="apikey" 
                                                    label="API Key"
                                                    value={values.apikey}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(touched.apikey && errors.apikey) && errors.apikey}
                                                    error={touched.apikey && errors.apikey ? true : false}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField 
                                                    required
                                                    margin="normal" 
                                                    fullWidth 
                                                    name="scrtkey" 
                                                    label="Secret Key"
                                                    value={values.scrtkey}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(touched.scrtkey && errors.scrtkey) && errors.scrtkey}
                                                    error={touched.scrtkey && errors.scrtkey ? true : false}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            disabled={selector.loading}
                                            variant='contained'
                                            fullWidth
                                            type='submit'
                                            startIcon={selector.loading && <CircularProgress size={20} />}
                                        >
                                            SAVE
                                        </Button>
                                    </CardActions>
                                </Card>
                            );
                        }
                    }
                </Formik>
            </Container>
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
        </React.Fragment>
    )
}