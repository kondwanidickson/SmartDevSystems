import * as React from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast, Flip } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { LockTwoTone } from '@mui/icons-material';
import { FcGoogle } from 'react-icons/fc';
import { AiFillGithub } from 'react-icons/ai';
import { onAuthStateChanged, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { TermsDialog } from '../Dialogs';
import { setDoc, getDoc } from 'firebase/firestore';
import { resetData } from '../../config/actions';
import { auth, docRef, CustomUser } from '../../config/firebase';

export default function Signin({handleClose}){
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();
    const [loading, setLoading] = React.useState({ id: "", status: false });
    const [disabled, setDisabled] = React.useState(false);
    // const [formData, setFormData] = React.useState({
    //     email: "",
    //     password: ""
    // });
    // const { email, password } = formData;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const route = React.useCallback( () => {
        if (pathname.includes("enquire") || pathname.includes("checkout")) {
            handleClose();
            return;
        }
        
        navigate('/app', { replace: true });
    },[pathname, handleClose, navigate]);

    React.useEffect(() => {
        
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

            if(currentUser){
                setTimeout(() => {
                    route();
                }, 3500);
            } else setDisabled(false);
        });

        return () => unsubscribe();

    },[setDisabled, route]);

    React.useEffect(() => {
        dispatch(resetData());
    },[dispatch]);

    // const onChange = (props) => (e) => {
    //     e.preventDefault();

    //     setFormData({ ...formData, [props]: e.target.value });
    // };

    // const onSubmit = async (e) => {
    //     try {
    //         e.preventDefault();

    //         setLoading({ id: "email/password", status: true });

    //         if(email === "" || password === ""){
    //             toast("Email/Password cannot be empty", {type: "warning"});
    //             setLoading({ id: "email/password", status: true });
    //             return;
    //         }

    //         const result = await signInWithEmailAndPassword(auth, email, password);

    //         if(result.user){
    //             toast("You have logged in successfully!", {type: "success"});
                
    //             setTimeout(() => {
    //                 checkIsAdmin(result.user.uid, "email/password");
    //             }, 5500);
    //             return;
    //         }

    //         toast("Login failed, email/password might be incorrect", {type: "error"});
    //         setLoading({ id: "email/password", status: false });
    //     } catch (error) {
    //         toast("Login failed, email/password might be incorrect", {type: "error"});
    //         setLoading({ id: "email/password", status: false });
    //         console.error(error);
    //     }
    // };

    const GoogleLogin = async () => {
        try {
            setLoading({ id: "google", status: true });
            const result = await signInWithPopup(auth, googleProvider);

            if(result.user){
                toast("You have logged in successfully!", {type: "success"});
                
                setTimeout(() => {
                    checkIsAdmin(result.user.uid, "google", result.user.email);
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
                    checkIsAdmin(result.user.uid, "github", result.user.email);
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

    const checkIsAdmin = (uid, authId, email) => {
        const userRef = docRef("users", uid);
                    
        getDoc(userRef)
        .then(doc => {
            if (doc.exists() === false) {
                setDoc(CustomUser(uid), { email }).then(_=>{
                    setLoading({ id: authId, status: false });

                    if (pathname.includes("enquire") || pathname.includes("checkout")) {
                        handleClose();
                        return;
                    }
                    
                    navigate('/app', { replace: true });
                    return;
                }).catch(error => {
                    console.error("Error fetching user:", error);
                })
            }

            if (doc.exists() === true) {
                const userData = doc.data();
                if (userData?.isAdmin) {
                    localStorage.setItem('isAdmin', true);

                    setLoading({ id: authId, status: false });

                    if (pathname.includes("enquire") || pathname.includes("checkout")) {
                        handleClose();
                        return;
                    }
                    
                    navigate('/admin', { replace: true });
                    return;
                }

                setLoading({ id: authId, status: false });

                if (pathname.includes("enquire") || pathname.includes("checkout")) {
                    handleClose();
                    return;
                }
                
                navigate('/app', { replace: true });
                return;
            }
        })
        .catch(error => {
            console.error("Error fetching user:", error);
        });

        setLoading({ id: authId, status: false });

        if (pathname.includes("enquire") || pathname.includes("checkout")) {
            handleClose();
            return;
        }
        
        navigate('/app', { replace: true });
    };

    return(
        <>
            <Box
                component={Paper}
                sx={{
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockTwoTone />
                </Avatar>
                <Typography component="h1" variant="h5" gutterBottom>
                    Sign In Now
                </Typography>
                <TermsDialog 
                    title={'Terms of Service'}
                    description={'If you are a new user, read these terms of service before you continue'}
                />
                <Box sx={{ mt: 1, py: 2 }}>
                    <Button
                        disabled={(loading.id === "google" && loading.status) ? true : disabled}
                        fullWidth
                        variant="contained"
                        startIcon={(loading.id === "google" && loading.status) ? <CircularProgress size={20} /> : <FcGoogle />}
                        onClick={GoogleLogin}
                        sx={{ mb: 2, borderRadius: 3 }}
                    >
                    SIGNIN WITH GOOGLE
                    </Button>
                    <Button
                        disabled={(loading.id === "github" && loading.status) ? true : disabled}
                        fullWidth
                        variant="contained"
                        startIcon={(loading.id === "github" && loading.status) ? <CircularProgress size={20} /> : <AiFillGithub />}
                        onClick={GithubLogin}
                        sx={{ borderRadius: 3 }}
                    >
                    SIGNIN WITH GITHUB
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