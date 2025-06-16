import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Title } from '../../components';
import data from '../../mock/data.json';

const { terms } = data;

export default function ScrollDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
        <Typography 
            variant='caption'
            fontWeight={500}
            {...props}
        >
            {props?.description}{' '}
            <Link color='primary.light' underline='none' sx={{ cursor: 'pointer' }} onClick={(_)=>handleClickOpen()}><strong>here</strong></Link>
        </Typography>
        <Dialog
            open={open}
            onClose={(_)=>handleClose()}
            scroll='paper'
            maxWidth='sm'
            fullWidth
        >
            <DialogTitle>{props?.title}</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ width: "100%" }}>
                    <Title paragraph>
                        {terms.title}
                    </Title>
                    
                    <Typography variant="body1" color={"#FFFFFF"} sx={{ marginBottom: '2rem' }}>
                        {terms.start_desc}
                    </Typography>

                    {
                        terms.list.map((term, index)=>(
                            <Stack
                                key={index}
                                direction='column'
                            >
                                <Typography variant="body1" color="primary.light" sx={{ mb: '1rem' }} >
                                    <strong>{index + 1}. {term.title}</strong>
                                </Typography>
                                {term?.content &&
                                    <Typography variant="body1" sx={{ mb: '2rem', ml: 3 }}>
                                        {term?.content}
                                    </Typography>
                                }
                                {term?.subs && 
                                    term?.subs.map((sub, _index) => (
                                        <Stack
                                            key={_index}
                                            direction='column'
                                            ml={3}
                                        >
                                            {sub?.title && 
                                                <Typography variant="subtitle1" color="primary.light" sx={{ mb: '1rem' }} >
                                                    <strong>{sub.title}</strong>
                                                </Typography>
                                            }
                                            {sub?.content &&
                                                <Typography variant="body1" sx={{ mb: 0.5 }}>
                                                    - {sub?.content}
                                                </Typography>
                                            }
                                        </Stack>
                                    ))
                                }
                            </Stack>
                        ))
                    }
                    
                    <Typography variant="body1" sx={{ marginBottom: '2rem' }}>
                        {terms.end_desc}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
            <Button color='error' onClick={(_)=>handleClose()}>CLOSE</Button>
            </DialogActions>
        </Dialog>
    </div>
  );
}