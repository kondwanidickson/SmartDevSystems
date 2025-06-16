import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';

import data from '../mock/data.json';
import { Payments, RoutesAppBar } from '../components/customer/dashboard';

const { routes } = data;

function useQueryParam(){
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
};

function getComponents(page){
    switch (page) {
        case "app":
            return <Box>App</Box>;
        case "payments":
            return <Payments />;
        default:
            break;
    }
}

export default function Dashboard(){
    let query = useQueryParam();
    const [page, setPage] = React.useState("");
    const navigate = useNavigate();
    
    const getService = React.useCallback( () => {
        const path = query.get('name') ? query.get('name') : "app";
        const route = routes.find(route => route.path === path);

        console.log({route});

        !route && navigate('/404', { replace: true });

        if(route){
            setPage(route.path);
        }
    },[query, navigate]);

    React.useEffect(() => {
        getService();
    },[getService])

    return(
        <React.Fragment>
            <Container maxWidth="xl">
                <RoutesAppBar activeTab={page} />
                {getComponents(page.toLowerCase())}
            </Container>
        </React.Fragment>
    );
}