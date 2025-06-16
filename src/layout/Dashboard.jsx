import React from 'react';
import { Outlet } from 'react-router-dom';
import { DrawerAppBar } from '../components/customer';

function Dashboard() {

    return (
        <div className='wrapper'>
            <DrawerAppBar>
                <Outlet />
            </DrawerAppBar>
        </div>
    )
}

export default Dashboard
