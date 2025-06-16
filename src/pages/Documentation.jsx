import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Stack, Typography } from '@mui/material';
import { CodeViewer } from '../components/customer/dashboard';
import { Title } from '../components';
import data from '../mock/data.json';

const appName = data.appName

const docs = { 
  title: 'Sending SMS', 
  name: 'Introduction', 
  link: '',
  content: 'The SMS API has been developed to ensure a simple interface for developers whilst providing flexibilityin terms of implementation.',
  methodParam: {
      method: 'POST',
      url: 'https://apisms.beem.africa/v1/send'
  },
  children: [
    { 
      childName: 'Sample Request Data', 
      links: [{ linkName: 'JSON', link: 'smsSendRequestData.json', type: 'json' }, { linkName: 'XML', link:'smsSendRequestData.xml', type: 'xml' }] 
    },
    { 
      childName: 'Sample Scripts', 
      links: [{ linkName: 'JS', link: 'smsSend.js', type: 'javascript' }, { linkName: 'PY', link: 'smsSend.py',type: 'py' }, { linkName: 'PHP', link: 'smsSend.php', type: 'php' }] 
    },
    { 
      childName: 'Sample Response Data', 
      links: [{ linkName: 'SUCCESS', link: 'smsSendSuccessResponse.json', type: 'json' }, { linkName: 'ERROR',link: 'smsSendErrorResponse.json', type: 'json' }] 
    }
  ] 
};

export default function Documentation(){
  return(
    <React.Fragment>
      <Helmet>
        <title> {appName.toUpperCase()} | Documentation </title>
      </Helmet>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Title align='center'>
          {docs.title}
        </Title>

        <Typography variant="body1" align='center' sx={{ marginBottom: '2rem' }} gutterBottom>
          {docs.content}
        </Typography>

        {
          docs.methodParam && 
            <>
              <Typography variant="body1" align='left' gutterBottom>
                <strong>Method: </strong>{' '}{docs.methodParam.method}
              </Typography>
              <Typography variant="body1" align='left' sx={{ marginBottom: '2rem' }} gutterBottom>
                <strong>URL: </strong>{' '}{docs.methodParam.url}
              </Typography>
            </>
        }
        {docs.children && docs.children.map(child => (
          <Stack key={child.childName} direction='column' width="100%">
            <Typography 
              variant="body1" 
              color="primary.light" 
              align='left'
              fontWeight={600} 
              sx={{ mb: '1rem' }} 
              gutterBottom
            >
              {child.childName}
            </Typography>
            <CodeViewer links={child.links} />
          </Stack>
        )) }
      </Container>
    </React.Fragment>
  );
}