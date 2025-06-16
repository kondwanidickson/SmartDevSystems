import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Card, CardContent, CardHeader, Container, Grid, TextField } from '@mui/material';
import { auth } from '../../../config/firebase';

import { getData, resetData } from '../../../config/actions';
import HideKey from './HideKey';

export default function Api(){
    const selector = useSelector(state => state.api);
    const [user] = useAuthState(auth);
    const [balance, setBalance] = React.useState("0");
    const [keys, setkeys] = React.useState(null);
    const dispatch = useDispatch();

    const getBalance = React.useCallback(() => {
        user && dispatch(getData("/apis/" + user.uid));

        if (selector.data) {
            setBalance(selector.data.creditBalance);
            setkeys(selector.data.keys);
        }

        dispatch(resetData());
    },[user, selector.data, dispatch]);

    React.useEffect(() => {
        getBalance();
    },[getBalance]);

    return(
        <React.Fragment>
            <Container maxWidth="xl" sx={{ my: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={6}>
                        <Card raised>
                            <CardHeader title={"SMS Credit Balance"} sx={{ color:  theme => theme.palette.primary.main }} />
                            <CardContent>
                                <TextField margin="normal" fullWidth value={balance} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Container maxWidth="xl" sx={{ my: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={6}>
                        <HideKey 
                            disabled={keys ? true : false} 
                            title={"SMS API key"} 
                            apikey={keys ? keys.apiKey : ""} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <HideKey 
                            disabled={keys ? true : false} 
                            title={"Secret key"} 
                            apikey={keys ? keys.scrtKey : ""} 
                        />
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    )
}