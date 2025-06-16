import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { EnquiryForm } from '../components';
import data from '../mock/data.json';

const appName = data.appName

export default function Enquiry(){
    return(
        <React.Fragment>
            <Helmet>
                <title> {appName.toUpperCase()} | Enquiry </title>
            </Helmet>
            <EnquiryForm />
        </React.Fragment>
    );
}