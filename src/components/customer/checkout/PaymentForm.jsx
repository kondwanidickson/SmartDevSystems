import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast, Flip } from 'react-toastify';
import { Formik, Form } from 'formik';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { FileCopy as FileCopyIcon, InfoOutlined } from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import AuthDialog from '../../Dialogs/AuthDialog';
import { ErrorLabel } from '../../Errors';
import { paymentMethod } from '../../../validation';
import { postData, resetData } from '../../../config/actions';
import { fCurrency } from '../../../utils/formatNumber';
import myImages from '../../../assets';
import { auth } from '../../../config/firebase';
import data from '../../../mock/data.json';

const { tiers } = data;
const paymentServices = [
  {
    name: "Airtel",
    image: myImages.airtel,
    account: "+265992507214"
  },
  {
    name: "Mpamba",
    image: myImages.mpamba,
    account: "+265887356013"
  },
  // {
  //   name: "Visa",
  //   image: myImages.visa,
  //   account: "-----------"
  // }
];

function useQueryParam(){
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
};

export default function PaymentForm() {
  const query = useQueryParam();
  const [user] = useAuthState(auth);
  const { service } = useParams();
  const { error, loading, data } = useSelector(state => state.api);
  const [open, setOpen] = React.useState(false);
  const [myPackage, setPackage] = React.useState(null);
  const [myServiceName, setServiceName] = React.useState("");
  const [hoveredState, setHoveredState] = React.useState({ name: '', state: -1 });
  // const [currency, setCurrency] = React.useState('MWK');
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
  
  // const handleChangeCurrency = () => {
  //   setCurrency(currency === 'MWK' ? 'USD' : 'MWK');
  // };

  const handleHover = (event, accountType, state) => {
    event.preventDefault();

    setHoveredState({ ...hoveredState, name: accountType, state })
  };  

  const handleCopy = (accountType) => {
    const textData = new ClipboardItem({ "text/plain": new Blob([accountType], { type: "text/plain" }) });
  
    navigator.clipboard.write([textData])
    .then(() => {
      toast(`Copied ${accountType} to clipboard`, {type: 'success'});
    })
    .catch((err) => {
      toast('Copy failed', {type: 'error'});
      console.error("Copy failed:", err);
    });
  };  
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Divider sx={{ my: 2 }} textAlign="left">
        <Typography variant="h6" color="primary" gutterBottom>
          {myServiceName}
        </Typography>
      </Divider>
      <Grid container>
        <Grid item xs={6}>
          <Typography gutterBottom>Category</Typography>
          <Typography gutterBottom>Price</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography gutterBottom>{myPackage?.package?.category}</Typography>
          <Typography gutterBottom>
            {"MWK " + fCurrency(myPackage?.price)}
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} textAlign="left">
        <Typography variant="h6" color="primary" gutterBottom>
          Select Account{' '}
          <MyTooltip
            title='You can process your payment by sending your funds to one of the accounts below.'
          >
            <InfoOutlined color='action' sx={{ ml: 0.5 }} />
          </MyTooltip>
        </Typography>
      </Divider>
      <Grid 
        container 
        spacing={1}
        sx={{
          '& .MuiStack-root': {
            bgcolor: grey[800],
            borderRadius: 2,
            boxShadow: 3,
            mb: 1,
            p: 0.5,
            position: 'relative', 
            cursor: 'pointer', 
          },
          '& .MuiPaper-root': {
            boxShadow: 3, 
            width: 50, 
            height: 50, 
            mr: 2, 
            p: 0.2,
          }
        }}
      >
        {
          paymentServices.map((ps, index) => (
            <Grid key={ps.name} item xs={12} md={index === 0 || index === 1 ? 6 : 12} >
              <Stack 
                component={Box}
                direction='row' 
                alignItems='center'
                onMouseEnter={(e) => handleHover(e, ps.name, 0)} 
                onMouseLeave={(e) => handleHover(e, ps.name, -1)} 
                onClick={() => handleCopy(ps.account)} 
              >
                <Paper 
                  component={Avatar} 
                  variant='rounded' 
                  src={ps.image} 
                />
                <Typography>{ps.account}</Typography>
                {(hoveredState.name === ps.name && hoveredState.state === 0) && ( 
                  <FileCopyIcon 
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: 24,
                      color: theme => theme.palette.primary.light,
                      opacity: 0.8,
                    }}
                  />
                )}
              </Stack>
            </Grid>
          ))
        }
      </Grid>
      <Divider sx={{ my: 2 }} textAlign="left">
        <Typography variant="h6" color="primary">
          Payment Details{' '}
          <MyTooltip
            title='You can enter the transaction details below from the reciept got after the transaction.'
          >
            <InfoOutlined color='action' sx={{ ml: 0.5 }} />
          </MyTooltip>
        </Typography>
      </Divider>
      <Formik
        initialValues={{
          provider: "",
          transid: "",
          fullname: "",
          amount: "",
          date: "",
          screenshot: null
        }}
        validationSchema={paymentMethod}
        onSubmit={async values => {
          await new Promise(resolve => setTimeout(resolve, 500));

          let formdata = new FormData();
          formdata.append('uid', user?.uid);
          formdata.append('myService', JSON.stringify({ 
            name: myServiceName,
            package: myPackage
           }));
          formdata.append('provider', values.provider);
          formdata.append('transid', values.transid);
          formdata.append('fullname', values.fullname);
          formdata.append('amount', values.amount);
          formdata.append('date', values.date);
          formdata.append('payment', values.screenshot);
          let bodyContent =  formdata;

          if (user && (!isAdmin || isAdmin === false)) {
            dispatch(postData("/payments/new-payment", bodyContent));
          } else {
            toast("User not authorized. Please signin first.", {type: "error"});

            handleClickOpen();
            return;
          }
        }}
      >
        {
          props => {
            const { values, errors, touched, setFieldValue, handleChange, handleBlur, handleSubmit } = props;

            return(
              <Grid component={Form} container spacing={3} onSubmit={handleSubmit}>
                <Grid item xs={12} md={6} sx={{ "& .MuiFormControl-root .MuiTextField-root": { mt: 4, mb: 2 } }}>
                  <TextField
                    required
                    id="provider"
                    name="provider"
                    label="Service Provider"
                    value={values.provider}
                    helperText={(touched.provider && errors.provider) && errors.provider}
                    error={touched.provider && errors.provider ? true : false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    autoComplete="provider"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    id="trans-id"
                    name="transid"
                    label="Transaction ID"
                    value={values.transid}
                    helperText={(touched.transid && errors.transid) && errors.transid}
                    error={touched.transid && errors.transid ? true : false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    autoComplete="transid"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    id="amount"
                    name="amount"
                    label="Amount"
                    value={values.amount}
                    helperText={(touched.fullname && errors.amount) && errors.amount}
                    error={touched.amount && errors.amount ? true : false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                    autoComplete="amount"
                    InputProps={{
                      startAdornment: 
                        <InputAdornment position="start">
                          <span
                            // style={{ cursor: 'pointer' }}
                            // onClick={handleChangeCurrency}
                          >
                            {'MWK'}
                          </span>
                        </InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Transaction Date *"
                      maxDate={dayjs(new Date().toISOString().split('T')[0])}
                      onChange={(newValue) => {
                        const event = {
                          target: {
                            name: "date",
                            value: new Date(newValue.$d).toLocaleDateString()
                          }
                        };
                        handleChange(event);
                      }}
                      sx={{ width: '100%' }}
                    >
                    {({ params, inputRef }) => (
                      <TextField 
                        {...params} 
                        inputRef={inputRef}
                        required 
                        fullWidth 
                        helperText={(touched.date && errors.date) && errors.date}
                        error={touched.date && errors.date ? true : false}
                        onBlur={handleBlur}
                      />
                    )}
                    </DatePicker>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}> 
                  <InputLabel>Payment Screenshot *</InputLabel>
                  <OutlinedInput
                    required
                    fullWidth
                    label="Payment Screenshot *"
                    onBlur={handleBlur}
                    error={touched.screenshot && errors.screenshot ? true : false}
                    sx={{
                        flex: 1,
                        boxShadow: 3,
                        '& .MuiOutlinedInput-input':{ 
                            height: 50, 
                            p: 0.5,
                        },
                        '& #screenshot[type="file"]::-webkit-file-upload-button':{
                            bgcolor: (theme)=> theme.palette.primary.main,
                            height: '100%',
                            borderRadius: 1
                        },
                    }}
                    inputProps={{ 
                        'id': 'screenshot',
                        'name': 'screenshot',
                        'aria-label': 'file names', 
                        'multiple': false, 
                        'accept': [".jpeg",".jpg",".png"],
                        onChange: (e) => setFieldValue('screenshot', e.currentTarget.files[0])
                    }}
                    type="file"
                  />
                  {(touched.screenshot && errors.screenshot) && <ErrorLabel label={errors.screenshot} />}
                </Grid>
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                  >
                    <Box sx={{ flexGrow: 1 }} />
                      <Button
                        disabled={loading}
                        variant="contained"
                        color="error"
                        type="reset"
                        sx={{ mr: 2 }}
                      >
                        RESET
                      </Button>
                      <Button
                        disabled={loading}
                        variant="contained"
                        type="submit"
                        startIcon={loading && <CircularProgress size={20} />}
                      >
                        CONFIRM
                      </Button>
                  </Stack>
                </Grid>
              </Grid>
            );
          }
        }
      </Formik>
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
    </React.Fragment>
  );
}

function MyTooltip({title}){
  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return(
    <Tooltip
      PopperProps={{
        disablePortal: true,
      }}
      onClick={handleTooltipOpen}
      onClose={handleTooltipClose}
      open={open}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      arrow
      title={title}
    >
      <InfoOutlined color='action' sx={{ ml: 0.5 }} />
    </Tooltip>
  );
}