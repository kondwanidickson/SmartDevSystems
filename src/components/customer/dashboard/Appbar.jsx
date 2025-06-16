import * as React from 'react';
import { Link, Tab, Tabs, Toolbar } from '@mui/material';

import data from '../../../mock/data.json';

const { routes } = data;

export default function Index({activeTab}){
    const [value, setValue] = React.useState(0);

    React.useEffect(() => {
        function getActiveTab(){
            if(activeTab){
                const index = routes.findIndex(route => route.path === activeTab);
                if(index > -1){
                    setValue(index);
                }
            }
        }

        getActiveTab();
    });
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return(
        <Toolbar disableGutters>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
                sx={{ my: "auto" }}
            >
                {
                    routes.map((route, index) => (
                        <Tab 
                            key={index}
                            LinkComponent={Link} 
                            label={route.name} 
                            href={`/app/dashboard?name=${route.path}`}
                        />
                    ))
                }
            </Tabs>
        </Toolbar>
    );
}