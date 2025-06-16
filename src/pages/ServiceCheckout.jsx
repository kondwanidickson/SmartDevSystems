import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Checkout } from '../components/customer';
import data from '../mock/data.json';

const appName = data.appName

export default function ServiceCheckout(){
    return(
        <React.Fragment>
            <Helmet>
                <title> {appName.toUpperCase()} | Payments </title>
            </Helmet>
            <Checkout />
        </React.Fragment>
    );
}