import * as React from 'react';
import { ToastContainer, toast, Flip } from 'react-toastify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';

export default function HideKey({ title, disabled = true, apikey = "key" }) {
    const [showKey, setShowKey] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
  
    React.useEffect(() => {
      let timer;
  
      if (showKey) {
        timer = setInterval(() => {
          setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    setShowKey(false);
                    return 0;
                }

                return prevProgress + 10;
          });
        }, 800);
      } else {
        clearInterval(timer);
      }
  
      return () => {
        clearInterval(timer);
      };
    }, [showKey]);
  
    const toggleShowKey = () => {
      setShowKey(!showKey);
    };

    const handleCopy = (apikey) => {
      const textData = new ClipboardItem({ "text/plain": new Blob([apikey], { type: "text/plain" }) });
    
      navigator.clipboard.write([textData])
      .then(() => {
        toast(`Copied to clipboard`, {type: 'success'});
      })
      .catch((err) => {
        toast('Copy failed', {type: 'error'});
        console.error("Copy failed:", err);
      });
    };  
  
    return (
      <Card raised>
        <CardHeader
          title={title}
          sx={{ color: (theme) => theme.palette.primary.main }}
          action={showKey && (
            <CircularProgressWithLabel progress={progress} />
          )}
        />
        <CardContent>
          <TextField
            disabled={disabled}
            margin="normal"
            fullWidth
            value={apikey}
            type={showKey ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {showKey ? (
                    <IconButton size="small" onClick={(_)=>handleCopy(apikey)}>
                      <FileCopyIcon
                        sx={{
                          cursor: 'pointer',
                          color: (theme) => theme.palette.primary.light,
                          fontSize: 24,
                          opacity: 0.8,
                        }}
                      />
                    </IconButton>
                  ) : (
                    <IconButton size="small" onClick={toggleShowKey}>
                      <Visibility sx={{ color: (theme) => theme.palette.primary.light }} />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          transition={Flip}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Card>
    );
  }
  
  function CircularProgressWithLabel({ progress }) {
    return (<CircularProgress size={20} variant="determinate" value={progress} />);
  }