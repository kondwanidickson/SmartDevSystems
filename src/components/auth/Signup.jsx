import * as React from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast, Flip } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Divider, Grid, Link, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { LockTwoTone } from '@mui/icons-material';
import { FcGoogle } from 'react-icons/fc';
import { AiFillGithub } from 'react-icons/ai';
import { onAuthStateChanged, GoogleAuthProvider, GithubAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

import { getDoc } from 'firebase/firestore';
import { resetData } from '../../config/actions';
import { auth, docRef } from '../../config/firebase';

export default function Signin(){
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();
    const [loading, setLoading] = React.useState({ id: "", status: false });
    const [disabled, setDisabled] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: "",
        password: ""
    });
    const { email, password } = formData;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authStateChanged = React.useCallback( () => {
        onAuthStateChanged(auth, (currentUser) => {

            if(currentUser){
                setTimeout(() => {
                    navigate('/app', { replace: true });
                }, 3500);
            } else setDisabled(false);
        });
    },[setDisabled, navigate]);

    React.useEffect(() => {

        dispatch(resetData());
        authStateChanged();

    },[authStateChanged, dispatch]);

    const onChange = (props) => (e) => {
        e.preventDefault();

        setFormData({ ...formData, [props]: e.target.value });
    };

    const onSubmit = async (e) => {
        try {
            e.preventDefault();

            setLoading({ id: "email/password", status: true });

            if(email === "" || password === ""){
                toast("Email/Password cannot be empty", {type: "warning"});
                setLoading({ id: "email/password", status: true });
                return;
            }

            const result = await signInWithEmailAndPassword(auth, email, password);

            if(result.user){
                toast("You have logged in successfully!", {type: "success"});
                
                setTimeout(() => {
                    checkIsAdmin(result.user.uid, "email/password");
                }, 5500);
                return;
            }

            toast("Login failed, email/password might be incorrect", {type: "error"});
            setLoading({ id: "email/password", status: false });
        } catch (error) {
            toast("Login failed, email/password might be incorrect", {type: "error"});
            setLoading({ id: "email/password", status: false });
            console.error(error);
        }
    };

    const GoogleLogin = async () => {
        try {
            setLoading({ id: "google", status: true });
            const result = await signInWithPopup(auth, googleProvider);

            if(result.user){
                toast("You have logged in successfully!", {type: "success"});
                
                setTimeout(() => {
                    checkIsAdmin(result.user.uid, "google");
                }, 5500);
                return;
            }

            toast("Login failed", {type: "error"});
            setLoading({ id: "google", status: false });
        }
        catch (error) {
            toast("Login failed", {type: "error"});
            setLoading({ id: "google", status: false });
            console.error(error.message);
        }
    };

    const GithubLogin = async () => {
        try {
            setLoading({ id: "github", status: true });
            const result = await signInWithPopup(auth, githubProvider);

            if(result.user){
                toast("You have logged in successfully!", {type: "success"});
                
                setTimeout(() => {
                    checkIsAdmin(result.user.uid, "github");
                }, 5500);
                return;
            }

            toast("Login failed", {type: "error"});
            setLoading({ id: "github", status: false });
        }
        catch (error) {
            toast("Login failed", {type: "error"});
            setLoading({ id: "github", status: false });
            console.error(error.message);
        }
    };

    const checkIsAdmin = (uid, authId) => {
        const userRef = docRef("users", uid);
                    
        getDoc(userRef)
        .then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                if (userData.isAdmin) {
                    console.log("User is an admin");
                    localStorage.setItem('isAdmin', true);

                    setLoading({ id: authId, status: false });
                    navigate('/admin', { replace: true });
                    return;
                }
            }
        })
        .catch(() => {
            // console.error("Error fetching user:", error);
        });

        setLoading({ id: authId, status: false });
        navigate('/app', { replace: true });
    };

    return(
        <>
            <Box
                component={Paper}
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockTwoTone />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={onChange("email")}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={onChange("password")}
                    />
                    <Button
                        disabled={disabled}
                        type="submit"
                        fullWidth
                        variant="contained"
                        startIcon={(loading.id === "email/password" && loading.status) && <CircularProgress size={20} />}
                        sx={{ mt: 3, mb: 2 }}
                    >
                    Sign Up
                    </Button>

                    <Grid container>
                        <Grid item xs />
                        <Grid item>
                            <Link href="/auth/signin" variant="body2">
                            {"Already have an account? Sign In"}
                            </Link>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }}>OR</Divider>

                    <Button
                        disabled={(loading.id === "google" && loading.status) ? true : disabled}
                        fullWidth
                        variant="contained"
                        startIcon={(loading.id === "google" && loading.status) ? <CircularProgress size={20} /> : <FcGoogle />}
                        onClick={GoogleLogin}
                        sx={{ mb: 2 }}
                    >
                    CONTINUE WITH GOOGLE
                    </Button>
                    <Button
                        disabled={(loading.id === "github" && loading.status) ? true : disabled}
                        fullWidth
                        variant="contained"
                        startIcon={(loading.id === "github" && loading.status) ? <CircularProgress size={20} /> : <AiFillGithub />}
                        onClick={GithubLogin}
                    >
                    CONTINUE WITH GITHUB
                    </Button>
                </Box>
            </Box>
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
        </>
    );
}