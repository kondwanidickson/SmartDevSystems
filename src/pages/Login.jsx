import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Signin } from '../components/auth';
import data from '../mock/data.json';

const appName = data.appName

export default function Login(){

    return(
        <React.Fragment>
            <Helmet>
                <title> {appName.toUpperCase()} | Login </title>
            </Helmet>
            <Signin />
        </React.Fragment>
        );
}