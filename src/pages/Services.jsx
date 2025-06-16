import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box, Card, CardActions, CardContent, CardHeader, CardMedia, Container, Grid, MenuItem, MenuList, Typography } from '@mui/material';
import { Title } from '../components';
import { fCurrency } from '../utils/formatNumber';
import myImages from '../assets';
import data from '../mock/data.json';

const { tiers } = data;

export default function Services() {

  return(
    <React.Fragment>
      <Container maxWidth="md" sx={{ padding: '2rem' }}>
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <Title paragraph>Explore our services</Title>
          <Typography variant="body1" sx={{ marginBottom: '2rem' }}>
          Looking for talented freelancers who can get the job done quickly and easily? Look no further! We can complete your project in just a few easy steps. Simply post your job, and we will review your job in less than 24 hours and respond to you. It's that easy! get started today and see how our platform can help you accomplish your goals.
          </Typography>
                    
          <Typography variant="subtitle2" sx={{ marginBottom: '2rem' }}>
          The prices change according to the customers needs!
          </Typography>
        </Box>
        <br />
        <Grid container spacing={3}>
          {
            tiers.map((service, index) => (
              <Grid 
                key={index} 
                item 
                xs={12} 
                sm={6} 
                md={6} 
                sx={
                  index === tiers.length - 1 && { 
                    marginX: 'auto' 
                  }
                }>
                <Card 
                  raised
                  sx={{ 
                    bgcolor: "#234343",
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 300, 
                    minHeight: 650,
                    boxShadow: 3,
                    transition: 'transform 450ms',
                    '&:hover': { 
                      boxShadow: 5, 
                      borderColor: 'neutral.outlinedHoverBorder', 
                      transform: 'scale(1.01)' 
                    } 
                  }}
                >
                  <CardHeader
                    title={"MWK " + fCurrency(service.price)}
                    titleTypographyProps={{ color: theme => theme.palette.primary.main, fontSize: 20, fontWeight: 'bold' }}
                    subheaderTypographyProps={{ align: 'center', }}
                  />
                  <CardMedia
                    image={myImages[service.package.category]}
                    sx={{
                      bgcolor: "transparent",
                      width: "100%",
                      height: 200
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                    {service.title}
                    </Typography>
                    <MenuList>
                      {service.description.map((item, _index) => (
                        <MenuItem key={_index}>
                        <Typography
                          sx={{
                            fontStyle: "oblique",
                            fontWeight: 500
                          }}
                        >{item}</Typography>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </CardContent>
                  <CardActions>
                    <Button
                      LinkComponent={Link}
                      fullWidth
                      variant="contained"
                      size="small"
                      to={`/enquire/${service.package.name}?&category=${service.package.category}`}
                    >
                      Enquire
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          }
        </Grid>
      </Container>
    </React.Fragment>
  );
}