import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import { Alert, AppBar, Box, Button, Chip, Container, CircularProgress, DialogContent, Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from '@mui/material';
import { fCurrency } from '../../utils/formatNumber';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function useQueryParam(){
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
};

export default function FullScreenDialog({open, handleClose, service}) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimeout);
  }, []);

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="primary"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} color="primary" variant="h6" component="div" flexGrow={1}>
              {service?.title}
            </Typography>
            {/* <Chip label="Malawi only" variant='filled' color='warning' size='small' /> */}
          </Toolbar>
        </AppBar>
        <DialogContent className='bg-services'>
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
                <ServiceContent service={service} />
              </React.Fragment>
            )
          }
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ServiceContent({ service }){
  const query = useQueryParam();
  const [serviceName, setService] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const _service = query.get('service');

    if (_service) {
      setService(_service);
      return;
    }

    navigate("/404", { replace: true });
  },[query, navigate]);

  return(
    <Container>
      <TableContainer component={Paper}>
          <Alert variant='outlined' icon={false} severity="info" sx={{ 
            color: "#FFFFFF", 
            m: 2 
          }}>
              {service?.content}
          </Alert>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                  <TableRow>
                      <StyledTableCell align="center" colSpan={4}>Pricing Table</StyledTableCell>
                  </TableRow>
                  <TableRow>
                      <StyledTableCell align="center">Package</StyledTableCell>
                      <StyledTableCell align="center" colSpan={3}>Facility</StyledTableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                {
                  service?.types?.map((_package, index) => (
                    <React.Fragment key={_package.name + '-' + index}>
                      <StyledTableRow
                          sx={{
                              bgcolor: theme => theme.palette.action.hover,
                              '& th': {
                                  fontSize: '0.875em',
                                  fontWeight: 700
                              }
                          }}
                      >
                          <StyledTableCell align="center">{`${_package?.name} Package`}</StyledTableCell>
                          <StyledTableCell align="center" component={"th"}>Offer</StyledTableCell>
                          <StyledTableCell align="center" component={"th"}>Price</StyledTableCell>
                          <StyledTableCell align="center" component={"th"} sx={{ width: "max-content" }} />
                      </StyledTableRow>
                      {_package?.categories?.map((category, _index) => (
                        <TableRow key={category?.name + _index}>
                          {/* <StyledTableCell rowSpan={1} /> */}
                          <StyledTableCell align="center" sx={{ textTransform: "capitalize" }}>{category?.name}</StyledTableCell>
                          <StyledTableCell align="center" sx={{ textTransform: "capitalize" }}>{category?.offers?.join(", ")}</StyledTableCell>
                          <StyledTableCell align="center" sx={{ textTransform: "capitalize" }}>
                            {(category?.greater === true ? "Starts @ " : "") + "MWK " + fCurrency(category?.price)}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {/* {category?.greater === false ? 
                              <Button 
                                LinkComponent={Link}
                                variant="outlined"
                                color="error"
                                to={`/checkout/${serviceName}?package=${_package?.name}&category=${category?.name}`}
                              >
                                SUBSCRIBE
                              </Button> : 
                              <Button 
                                LinkComponent={Link}
                                variant="outlined"
                                color="info"
                                to={`/enquire/${serviceName}?package=${_package?.name}&category=${category?.name}`}
                              >
                                ENQUIRE
                              </Button>
                            } */}
                            <Button 
                              LinkComponent={Link}
                              variant="outlined"
                              color="info"
                              to={`/enquire/${serviceName}?package=${_package?.name}&category=${category?.name}`}
                            >
                              ENQUIRE
                            </Button>
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))
                }
              </TableBody>
          </Table>
      </TableContainer>
    </Container>
  );
}