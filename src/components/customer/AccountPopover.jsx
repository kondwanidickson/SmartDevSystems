import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Divider, IconButton, Popover, Stack, Tooltip, Typography } from '@mui/material';
// import { SignOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

export default function AccountPopover({user}){
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const signout = async (e) => {
        e.preventDefault();
        handleCloseUserMenu();

        const isAdmin = localStorage.getItem('isAdmin');

        if (isAdmin) localStorage.removeItem('isAdmin');

        auth.signOut();

        navigate('/', { replace: true });
    };

    return(
        <React.Fragment>
            <Tooltip title={user?.email}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                        alt={user?.email} 
                        src={user?.photoURL}
                    />
                </IconButton>
            </Tooltip>
            <Popover
                id="menu-appbar"
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                sx={{
                    minWidth: 360
                }}
            >
                <Stack direction="column" sx={{  display: 'flex', alignItems: 'center', py: 2, px: 2.5, minWidth: 360 }}>
                    <Box sx={{ flexGrow: 1, width: "-webkit-fill-available" }}>
                        <Typography variant="subtitle1">Name</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {user?.displayName}
                        </Typography>
                    </Box>
                    <Divider />
                    <Button
                        fullWidth
                        size="small"
                        variant="contained"
                        onClick={signout}
                    >
                        LOGOUT
                    </Button>
                </Stack>
            </Popover>
        </React.Fragment>
    );
}