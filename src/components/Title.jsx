import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textShadow: "0 0 10px rgba(0, 0, 0, .3)",
  fontSize: "1.5rem",
  [theme.breakpoints.up('xs')]: {
    fontSize: "1.2rem",
  },
  [theme.breakpoints.up('sm')]: {
      fontSize: "1.5rem"
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.8rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2rem',
  },
  fontWeight: 700,
  mx: "auto",
  my: 0,
  paddingBottom: "0.3rem"
}));

function Title(props) {
  return (
    <StyledTitle component="h1" {...props}>{props.children}</StyledTitle>
  )
}

export default Title
