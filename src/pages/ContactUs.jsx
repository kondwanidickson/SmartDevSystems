import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Contact } from '../components';
import data from '../mock/data.json';

// ----------------------------------------------------------------------

const appName = data.appName

export default function ContactUs(){
    return(
        <React.Fragment>
            <Helmet>
                <title> {appName.toUpperCase()} | Contact Us </title>
            </Helmet>
            <Contact />
        </React.Fragment>
    );
}