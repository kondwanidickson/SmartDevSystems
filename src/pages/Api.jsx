import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '@mui/material';
import { Api as AdminApiComponent } from '../components/admin';
import { Api as CustomerApiComponent } from '../components/customer/dashboard';
import data from '../mock/data.json';

// ----------------------------------------------------------------------

const appName = data.appName

export default function Api(){
  const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));

  return(
    <React.Fragment>
      <Helmet>
        <title> {appName.toUpperCase()} | API </title>
      </Helmet>
      <Container maxWidth="xl">
        {isAdmin ? <AdminApiComponent /> : <CustomerApiComponent />}
      </Container>
    </React.Fragment>
  );
}