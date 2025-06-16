import * as React from 'react';
import { Box, CircularProgress } from '@mui/material';

function LazyLoadingMiddleware(){
  return (
    <React.Fragment>
      <Box
        component='main'
        sx={{ 
          minWidth: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          my: "auto",
          zIndex: (theme) => theme.zIndex.drawer + 1 
        }}
      >
        <CircularProgress sx={{ m: "auto" }} />
      </Box>
    </React.Fragment>
  );
};

export default LazyLoadingMiddleware;
