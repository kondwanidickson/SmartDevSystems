import * as React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import { Home } from '@mui/icons-material';
import { Signin } from '../auth';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AuthDialog({open, handleClose}) {
  return (
    <div>
      <Dialog
        open={open}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
      >
        <Toolbar>
          <Box flexGrow={1} />
          <Button
            edge="start"
            size="small"
            LinkComponent={Link}
            color="primary" 
            href="/"
            aria-label="home"
            startIcon={<Home />}
          >
            Home
          </Button>
        </Toolbar>
        <Signin handleClose={handleClose} />
      </Dialog>
    </div>
  );
}
