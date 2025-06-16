import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Tooltip, Typography, Switch } from '@mui/material';
import { ApiContext } from './context';

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));

export default function CurrencySwitch() {
  const { currency, setCurrency } = React.useContext(ApiContext);

  const change_currency = (e) => {
    e.preventDefault();

    const new_currency = e.target.checked === true ? "MWK" : "USD";
    
    localStorage.setItem("sds_currency", JSON.stringify(update_local_user));
    setCurrency(new_currency);
  }

  return (
    <>
      <Tooltip title={'CURRENCY'}>
        <Stack direction="row" spacing={1} alignItems="center">
          <AntSwitch 
            onClick={change_currency} 
            size='small' 
            color="warning"
            sx={{ m: 1 }} 
            checked={currency === "MWK" ? true : false}
            disabled={!currency || currency === "" ? true : false}
          />
          <Stack direction="column">
            <Typography fontWeight={currency === "USD" && "bold"}>USD</Typography>
            <Typography fontWeight={currency === "MWK" && "bold"}>MWK</Typography>
          </Stack>
        </Stack>
      </Tooltip>
    </>
  );
}
