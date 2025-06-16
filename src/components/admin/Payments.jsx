import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { styled } from '@mui/material/styles';
import { 
  Box, 
  CircularProgress,
  Table, 
  TableBody, 
  TableCell, 
  tableCellClasses, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper
} from '@mui/material';
import Label from '../label';
import { fCurrency } from '../../utils/formatNumber';
import { ImageDialog } from '../Dialogs';

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
    $_status: Boolean
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
      _status: $_status
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
      _status
      url
    }
  }
`;

const update_payment = gql`
  mutation UpdatePayment (
    $id: String!
    $_status: Boolean
  ) {
    updatePayment (
      id: $id
      _status: $_status
    ) {
      id
      _status
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
  const { loading, error, data } = useQuery(getPayments, { variables: {} });
  const [updatePayment] = useMutation(update_payment);

  React.useEffect(() => {
    if (error) {
      console.log({error});
    }
  },[error]);

  const update = (e, id, _status) => {
    e.preventDefault();
    updatePayment({
      variables: {
        id,
        _status
      },
      refetchQueries: [getPayments, "PaymentsQuery"]
    });
  }

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
                      <ImageDialog payment={payment} update={update} />
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
                <TableCell align="center" colSpan={6}>
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
                <TableCell align="center" colSpan={6}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            }
            </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentsComponent;
