import {React, useState} from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

//Display any additional info of device  such as graphs
const DrawerContent = (props) => {
  return (
    <Box display="flex" flexDirection="column" gap={2} sx={{ width: 600 }} role="presentation" onClick={props.onClose}>
      {props.IOTTrafficHistory && <props.IOTTrafficHistory deviceId={props.deviceId}/>}
      {props.deviceIdNo !== null && props.IOTTrafficPrediction && <props.IOTTrafficPrediction deviceIdNo={props.deviceIdNo}/>}
      <Button onClick={props.onClose}>Close</Button>
    </Box>
  )
};

export default DrawerContent;
