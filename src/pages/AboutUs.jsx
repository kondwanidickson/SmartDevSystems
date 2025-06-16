import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { About, Banner } from '../components';
import myImages from '../assets';
import data from '../mock/data.json';

const appName = data.appName

export default function AboutUs(){
    return(
        <React.Fragment>
            <Helmet>
                <title> {appName.toUpperCase()} | About Us </title>
            </Helmet>
            <Banner title="About Us" bannerImage={myImages.banner} />
            <About />
        </React.Fragment>
    );
}