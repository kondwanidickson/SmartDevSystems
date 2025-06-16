import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Tab, Tabs, Toolbar } from '@mui/material';
import { dracula, CodeBlock } from "react-code-blocks";

import axios from '../../../config/instance';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`code-tabpanel-${index}`}
      aria-labelledby={`code-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ 
          display: "flex", 
          p: 3, 
          mx: "auto", 
          '& span': {
            width: "100%",
            mx: "auto",
            '& :nth-child(2)': {
              textWrap: "wrap"
            }
          }
        }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `code-tab-${index}`,
    'aria-controls': `code-tabpanel-${index}`,
  };
}

export default function CodeViewer({ links }){
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

    return(
      <React.Fragment>
        <Toolbar disableGutters>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            sx={{ my: "auto" }}
          >
            {
              links.map((tab, index) => (
                <Tab 
                  key={index}
                  label={tab.linkName}
                  {...a11yProps(index)}  
                />
              ))
            }
          </Tabs>
        </Toolbar>
        <br />
        {links.map((tab, index) => (
          <TabPanel key={index} value={value} index={index}>
            <CodeView
              filePath={tab.link}
              type={tab.type}
            />
          </TabPanel>
        ))}
      </React.Fragment>
    );
}

function CodeView({ filePath, type }){
  const [code, setCode] = React.useState('');

  React.useEffect(() => {
    const fetchCode = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${process.env.REACT_APP_GIT_ACCOUNT}/${process.env.REACT_APP_GIT_REPO}/contents/${filePath}`
        );
        const { content } = response.data;
        const decodedContent = atob(content); // Decoding base64-encoded content
        setCode(decodedContent);
      } catch (error) {
        console.error('Error fetching code:', error);
      }
    };

    fetchCode();
  }, [filePath]);

  return(
    <CodeBlock
      text={code}
      language={type}
      showLineNumbers
      wrapLines={true}
      theme={dracula}
      codeBlock
    />
  );
}