import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Visibility from '@mui/icons-material/Visibility';
import { fCurrency } from '../../utils/formatNumber';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PaymentViewDialog({payment, update}) {
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
        <Visibility color='primary' />
      </IconButton>
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <DialogTitle color="primary">{"Payment"}</DialogTitle>
        <DialogContent>
          <Stack direction="column" alignItems="center" justifyContent="center">
            <Grid container spacing={2} sx={{ mx: "auto" }}>
              <Grid item xs={12} md={6}>
                <TableContainer>
                  <Table>
                    <TableBody 
                      sx={{
                        "& .MuiTableRow-root": {
                          fontStyle: "oblique",
                          "& :nth-of-type(1)": {
                            fontWeight: 700
                          }
                        }
                      }}
                    >
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>{payment?.fullname}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Service Name</TableCell>
                        <TableCell>{payment?.my_service?.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Provider</TableCell>
                        <TableCell>{payment?.provider}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Transaction ID</TableCell>
                        <TableCell>{payment?.transid}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>{payment?.date}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Amount</TableCell>
                        <TableCell>MWK{fCurrency(parseInt(payment?.amount))}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper component={"img"} src={payment?.url} sx={{ height: 345, width: "100%", boxShadow: 3 }} />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>CLOSE</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
