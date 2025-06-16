import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

function LoadingMiddleware({ element: Element }){
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulating an async operation
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimeout);
  }, [location.pathname]);

  return (
    <React.Fragment>
      {
        isLoading ? (
          <Box
            sx={{ 
              minWidth: "100%",
              minHeight: "85vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              my: "auto",
              zIndex: (theme) => theme.zIndex.drawer + 1 
            }}
          >
            <CircularProgress sx={{ m: "auto" }} />
          </Box>
        ) : (
          <React.Fragment>
            <Element />
          </React.Fragment>
        )
      }
    </React.Fragment>
  );
};

export default LoadingMiddleware;
