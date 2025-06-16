import * as React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { Avatar, Container } from '@mui/material';
import { Api, ContactSupport, Description, Home, Info, Payments } from '@mui/icons-material';
import data from '../../mock/data.json';
import { auth } from '../../config/firebase';
import { StyledNavItem, StyledNavItemIcon } from './styles';
import AccPopover from './AccountPopover';
import Copyright from '../Copyright';
import myImages from '../../assets';

const appName = data.appName
const drawerWidth = 240;
const navItems = (path) => [
  {
    name: 'PAYMENTS',
    href: `/${path}/payments`,
    icon: <Payments />,
  },
  {
    name: 'API',
    href: `/${path}/api`,
    icon: <Api />,
  },
  {
    name: 'INTEGRATION',
    href: `/${path}/integration`,
    icon: <Description />,
  }
];

const navSubItems = [
  {
    name: 'HOME',
    href: '/',
    icon: <Home />
  },{
    name: 'ABOUT',
    href: '/about',
    icon: <Info />
  },
  {
    name: 'CONTACT',
    href: '/contact',
    icon: <ContactSupport />
  }
];

export default function DrawerAppBar(props) {
  const { window } = props;
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [user] = useAuthState(auth);
  const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
  const path = isAdmin ? "admin" : "app";

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Avatar variant={"square"} src={myImages.logo1} alt={appName} sx={{ width: "100%", my: 0.5 }} />
      </Toolbar>
      <Divider />
      <List>
        {navItems(path).map((item) => (
          <NavItem key={item.name} item={item} setMobileOpen={() => setMobileOpen(false)} />
        ))}
      </List>
      <Divider />
      <List>
        {navSubItems.map((item) => (
          <NavItem key={item.name} item={item} setMobileOpen={() => setMobileOpen(false)} />
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <React.Fragment>
      <Stack direction="row">
        <Box display={{ xs: 'none', sm: 'none', md: 'block' }} width={drawerWidth} />
        <Stack direction='column' width={{ xs: '100vw', md: `calc(100vw - ${drawerWidth}px)` }}>
          <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
              component="nav"
              position="fixed"
              sx={{
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
              }}
            >
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
                      // md: 'block' 
                    } 
                  }}
                />
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { md: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
                <Stack
                  direction='row'
                  display={{ md: 'none' }}
                  alignItems='center'
                  justifyContent='center'
                  width='100%'
                >
                  <Avatar 
                    variant="square"
                    src={myImages.logo1} 
                    alt={appName} 
                    sx={{ 
                      width: 200,
                      mx: 'auto',
                      display: { 
                        md: 'none' 
                      } 
                    }}
                  />
                </Stack>
                <Box flexGrow={1} display={{ xs: 'none', sm: 'block' }} />
                {user && <AccPopover user={user} />}
              </Toolbar>
            </AppBar>
            <Toolbar />
            <Box
              component="nav"
              sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
            >
              {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
              <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: 'block', sm: 'block', md: 'none' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, height: '100vh' },
                }}
              >
                {drawer}
              </Drawer>
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', sm: 'none', md: 'block' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, height: '100vh' },
                }}
                open
              >
                {drawer}
              </Drawer>
            </Box>
          </Box>
          <Stack
            component="main"
            direction="column" 
            minHeight={`calc(100vh - ${70 + Number(theme.mixins.toolbar.minHeight)}px)`}
            sx={{ 
              bgcolor: theme.palette.background.default,
              flexGrow: 1, 
            }}
          >
            {props.children}
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row">
        <Box display={{ xs: 'none', sm: 'none', md: 'block' }} width={drawerWidth} />
        <Container
            maxWidth="xl"
            component="footer"
            sx={{
              bgcolor: theme.palette.background.default,
              borderTop: `1px solid ${theme.palette.divider}`,
              height: 70,
              py: [1.5, 1.5],
            }}
        >
            <Copyright sx={{ my: "auto" }} />
        </Container>
      </Stack>
    </React.Fragment>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item, setMobileOpen }) {
  const { name, href, icon, children } = item;
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const handleClick = (event) => {
    event.preventDefault()
    setOpen(!open);
  };

  const navigateTo = (e, to) => {
    e.preventDefault();
    setMobileOpen();

    navigate(to);
  };

  return (
    <>
      {children ? 
        <>
          <StyledNavItem
            onClick={(event)=> handleClick(event)}
            sx={{
              '&.active': {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightBold',
              },
            }}
          >
            <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

            <ListItemText disableTypography primary={name} />
            {open && <ExpandLess key={"less-" + name} />}
            {!open && <ExpandMore key={"more-" + name} />}
          </StyledNavItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
              {children.map((_item)=>(
                <StyledNavItem 
                  onClick={e=>navigateTo(e,href + _item?.href)}
                  sx={{
                    '&.active': {
                      color: 'text.primary',
                      bgcolor: 'action.selected',
                      fontWeight: 'fontWeightBold',
                    },
                    ml: 2
                  }}
                >
                  <StyledNavItemIcon>{_item?.icon && _item?.icon}</StyledNavItemIcon>

                  <ListItemText disableTypography primary={_item?.name} />

                  {/* {_item?.info && _item?.info} */}
                </StyledNavItem>
              ))}
          </Collapse>
        </> : 
        <StyledNavItem
          onClick={e=>navigateTo(e,href)}
          sx={{
            '&.active': {
              color: 'text.primary',
              bgcolor: 'action.selected',
              fontWeight: 'fontWeightBold',
            },
          }}
        >
          <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

          <ListItemText disableTypography primary={name} />
          {/* {info && info} */}
        </StyledNavItem>
      }
    </>
  );
}
