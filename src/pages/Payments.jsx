import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '@mui/material';
import { PaymentsComponent as AdminPayments } from '../components/admin';
import { Payments as CustomerPayments} from '../components/customer/dashboard';
import data from '../mock/data.json';

const appName = data.appName

export default function Payments(){
  const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));

  return(
    <React.Fragment>
      <Helmet>
        <title> {appName.toUpperCase()} | Payments </title>
      </Helmet>
      <Container maxWidth="xl">
        {isAdmin ? <AdminPayments /> : <CustomerPayments />}
      </Container>
    </React.Fragment>
  );
}