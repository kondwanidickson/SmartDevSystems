import * as React from 'react';
import PropTypes from 'prop-types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link as NavLink, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import data from '../mock/data.json';
import myImages from '../assets';
import AccPopover from './customer/AccountPopover';
import { auth } from '../config/firebase';
import { Stack } from '@mui/material';

const appName = data.appName
const drawerWidth = 240;
const navItems = [
  'HOME', 
  'SERVICES',
  'ABOUT',
  'INTEGRATION', 
  'CONTACT',
];

function DrawerAppBar(props) {
  const [user] = useAuthState(auth);
  const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = (e) => {
    e.preventDefault();
    setMobileOpen((prevState) => !prevState);
  };

  const navigateTo = (e, to) => {
    e.preventDefault();
    setMobileOpen(false);

    navigate(to === "home" ? "/" : to);
  };

  const drawer = (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        height: '100%',
        p: 1
      }}
    >
      <Avatar variant={"square"} src={myImages.logo1} alt={appName} sx={{ width: "100%", mb: 0.5 }} />
      <Divider />
      <List>
        {[
          user ? ((isAdmin && isAdmin === true) ? "ADMIN" : "APP") : null, 
          ...navItems].map((item) => (
          item && 
            <ListItemButton 
              key={item} 
              onClick={(e)=>navigateTo(e, item.toLowerCase())}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={item} />
            </ListItemButton>
        ))}
      </List>
      <Box flexGrow={1} />
      {!user && 
        <Button 
          LinkComponent={NavLink} 
          to="/auth" 
          fullWidth
          variant="contained" 
          color="primary"
        >
          SIGNIN
        </Button>
      }
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav" position="fixed">
        <Toolbar>
          <Avatar 
            variant="square"
            src={myImages.logo1} 
            alt={appName} 
            sx={{ 
              mr: 2,
              minWidth: 200,
              display: { 
                xs: 'none', 
                sm: 'block' 
              } 
            }}
          />
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={(e)=>handleDrawerToggle(e)}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Stack
            direction='row'
            display={{ sm: 'none' }}
            alignItems='center'
            justifyContent='space-between'
            width='100%'
            mr={2}
          >
            <Avatar 
              variant="square"
              src={myImages.logo1} 
              alt={appName} 
              sx={{ 
                width: 200,
                mx: 'auto',
                display: { 
                  sm: 'none' 
                } 
              }}
            />
          </Stack>
          <Box flexGrow={1} display={{ xs: 'none', sm: 'block' }} />
          <Box sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}>
            {[
              user ? ((isAdmin && isAdmin === true) ? "ADMIN" : "APP") : null, 
              ...navItems].map((item) => (
              item && 
                <Button 
                  key={item} 
                  onClick={(e)=>navigateTo(e, item?.toLowerCase())}
                  sx={{ color: '#fff' }}
                >
                  {item}
                </Button>
            ))}
          </Box>
          {
            user ? 
              <AccPopover user={user} /> : 
              <Button 
                LinkComponent={NavLink} 
                to="/auth" 
                variant="contained" 
                color="primary"
              >
                SIGNIN
              </Button>
          }
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={(e)=>handleDrawerToggle(e)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;