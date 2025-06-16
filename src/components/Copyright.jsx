import { Typography, Stack } from '@mui/material';
import { TermsDialog } from './Dialogs';
import data from '../mock/data.json';

const appName = data.appName;
const title = 'Terms and Policies';
const description = 'Read terms and policies';

export default function Copyright(props) {
  return (
    <Stack direction='column' textAlign='center'>
      <TermsDialog 
        title={title}
        description={description}
        color='text.secondary'
        gutterBottom
      />
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        {appName}{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Stack>
  );
}
