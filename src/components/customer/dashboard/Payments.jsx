import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery, useMutation, gql } from '@apollo/client';
import { ToastContainer, toast, Flip } from 'react-toastify';
import { Formik, Form } from 'formik';
import { styled } from '@mui/material/styles';
import { 
  Box, 
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Table, 
  TableBody, 
  TableCell, 
  tableCellClasses, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField,
  Toolbar,
  Typography,
  Paper,
  Slide,
  Stack
} from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Delete, Info, Edit } from '@mui/icons-material';
import { ErrorLabel } from '../../Errors';
import { paymentMethod as paymentModVer } from '../../../validation';
import { PaymentViewDialog } from '../../Dialogs';
import Label from '../../label';
import { postData, resetData } from '../../../config/actions';
import { fCurrency } from '../../../utils/formatNumber';
import { auth } from '../../../config/firebase';

const getPayments = gql`
  query PaymentsQuery(
    $id: String
    $uid: String
    $my_service: ServiceInput
    $provider: String
    $transid: String
    $fullname: String
    $amount: String
    $date: String
    $url: String
  ) {
    payments(
      id: $id
      uid: $uid
      my_service: $my_service
      provider: $provider
      transid: $transid
      amount: $amount
      fullname: $fullname
      date: $date
      url: $url
    ) {
      id
      uid
      my_service {
        name
        package {
          name
          greater
          offers
          price
        }
      }
      provider
      transid
      amount
      fullname
      date
      url
    }
  }
`;

const delete_payment = gql`
  mutation DeletePayment (
    $id: String!
  ) {
    deletePayment (
      id: $id
    ) {
      id
    }
  }
`;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
  
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-of-type td, &:last-of-type th': {
    border: 0,
  },
}));

const PaymentsComponent = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <Box sx={{ my: 4 }}>
      <h2>Payments History</h2>
      <TableContainer component={Paper}>
        <Table aria-label="payments table">
            <TableHead>
                <StyledTableRow
                    sx={{
                        bgcolor: theme => theme.palette.action.hover,
                        '& th': {
                            fontSize: '0.875em',
                            fontWeight: 500
                        }
                    }}
                >
                    <StyledTableCell>ID</StyledTableCell>
                    <StyledTableCell align="left">Service Name</StyledTableCell>
                    <StyledTableCell align="center">Transaction ID</StyledTableCell>
                    <StyledTableCell align="center">Amount</StyledTableCell>
                    <StyledTableCell align="center">Date</StyledTableCell>
                    <StyledTableCell align="center">Verified</StyledTableCell>
                    <StyledTableCell align="right" />
                </StyledTableRow>
            </TableHead>
            {(!loading && user) && <TableData uid={user.uid} />}
            {loading && 
              <TableBody>
                <TableRow 
                  sx={{ 
                    '&:last-of-type td, &:last-of-type th': {
                      border: 0,
                    }
                  }}
                >
                  <TableCell align="center" colSpan={7}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            }
        </Table>
      </TableContainer>
    </Box>
  );
};

function TableData({uid}){
  const { loading, data, refetch } = useQuery(
    getPayments, 
    { 
      variables: {
        uid
      } 
    }
  );
  const [deletePayment] = useMutation(delete_payment);

  const _delete = (id) => { 
    deletePayment({
      variables: { id },
      refetchQueries: [getPayments, "PaymentsQuery"]
    });
  }

  return(
    <TableBody>
    {(!loading && data && data?.payments?.length >= 1) && data?.payments?.map((payment, index) => (
      <TableRow 
        key={payment?.id} 
        sx={{ 
          '&:last-of-type td, &:last-of-type th': {
            border: 0,
          }
        }}
      >
        <TableCell>{index + 1}</TableCell>
        <TableCell align="left">{payment?.my_service?.name}</TableCell>
        <TableCell align="center">{payment?.transid}</TableCell>
        <TableCell align="center">MWK{fCurrency(parseInt(payment?.amount))}</TableCell>
        <TableCell align="center">{payment?.date}</TableCell>
        <TableCell align="center">
          <Label color={payment?._status === true ? "success" : "error"}>
            {payment?._status === true ? "Verified" : "Not Verified"}
          </Label>
        </TableCell>
        <TableCell align="right">
          <Stack
            direction='row'
            alignItems='center'
            justifyContent='center'
          >
            <PaymentViewDialog payment={payment} />
            {payment?._status === false && 
              <React.Fragment>
                <UpdateDialog payment={payment} refetch={refetch} />
                <DeleteAlert _delete={()=>_delete(payment?.id)} />
              </React.Fragment>
            }
          </Stack>
        </TableCell>
      </TableRow>
    ))}
    {(!loading && data && data?.payments?.length < 1) && 
      <TableRow 
        sx={{ 
          '&:last-of-type td, &:last-of-type th': {
            border: 0,
          }
        }}
      >
        <TableCell align="center" colSpan={7}>
          No data!
        </TableCell>
      </TableRow>
    }
    {loading &&
      <TableRow 
        sx={{ 
          '&:last-of-type td, &:last-of-type th': {
            border: 0,
          }
        }}
      >
        <TableCell align="center" colSpan={7}>
          <CircularProgress />
        </TableCell>
      </TableRow>
    }
    </TableBody>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function DeleteAlert({_delete}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <Delete color='error' />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        maxWidth='sm'
        fullWidth
        onClose={handleClose}
      >
        <DialogTitle>
          <Toolbar sx={{ px: 0 }}>
            <IconButton
              edge="start"
              color='error'
              onClick={handleClose}
              aria-label="close"
            >
              <Info />
            </IconButton>
            <Typography color='error' sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Remove Payment
            </Typography>
          </Toolbar>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you want to proceed with removing this payment. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={handleClose}>CANCEL</Button>
          <Button onClick={(_)=>_delete()}>AGREE</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function UpdateDialog({payment, refetch}) {
  const selector = useSelector(state => state.api);
  const [user] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const [currency, setCurrency] = React.useState('MWK');
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (selector.data) {
      refetch();
      toast(selector.data.message, {type: "success"});
      return;
    }

    if (selector.error) {
      toast(selector.error.message, {type: "error"});
      return;
    }

    dispatch(resetData());
  },[selector.error, selector.data, refetch, dispatch]);
  
  const handleChangeCurrency = () => {
    setCurrency(currency === 'MWK' ? 'USD' : 'MWK');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <Edit color='primary' />
      </IconButton>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>
          <Toolbar>
            <Typography color='primary' sx={{ flex: 1 }} variant="h6" component="div">
              Update Payment
            </Typography>
          </Toolbar>
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              provider: "",
              transid: "",
              fullname: "",
              amount: "",
              date: "",
              screenshot: null
            }}
            validationSchema={paymentModVer}
            onSubmit={async values => {
              await new Promise(resolve => setTimeout(resolve, 500));

              let formdata = new FormData();
              formdata.append('uid', user?.uid);
              formdata.append('id', payment?.id);
              formdata.append('myService', JSON.stringify({ 
                name: payment?.my_service?.name,
                package: payment?.my_service?.package
              }));
              formdata.append('provider', values.provider);
              formdata.append('transid', values.transid);
              formdata.append('fullname', values.fullname);
              formdata.append('amount', values.amount);
              formdata.append('date', values.date);
              formdata.append('payment', values.screenshot);
              let bodyContent =  formdata;

              if (user) {
                dispatch(postData("/payments/update-payment", bodyContent));
              } else {
                toast("User not authorized. Please signin first.", {type: "error"});
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
                        helperText={(touched.fullname && errors.amount) ? errors.amount : "Click currency to change between MWK and USD"}
                        error={touched.amount && errors.amount ? true : false}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        autoComplete="amount"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">
                            <span
                              style={{ cursor: 'pointer' }}
                              onClick={handleChangeCurrency}
                            >
                              {currency}
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
                          disabled={selector.loading}
                          variant="contained"
                          color="error"
                          onClick={handleClose}
                          sx={{ mr: 2 }}
                        >
                          CANCEL
                        </Button>
                        <Button
                          disabled={selector.loading}
                          variant="contained"
                          color="error"
                          type="reset"
                          sx={{ mr: 2 }}
                        >
                          RESET
                        </Button>
                        <Button
                          disabled={selector.loading}
                          variant="contained"
                          type="submit"
                          startIcon={selector.loading && <CircularProgress size={20} />}
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
        </DialogContent>
      </Dialog>
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
    </div>
  );
}

export default PaymentsComponent;
