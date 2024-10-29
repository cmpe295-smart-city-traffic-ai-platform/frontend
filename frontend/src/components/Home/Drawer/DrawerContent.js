import {React, useState} from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
//Display any additional info of device  such as graphs
const DrawerContent = (props) => {
  return (
    <Box display="flex" flexDirection="column" gap={2} sx={{ width: 800 }} role="presentation" onClick={props.onClose}>
      <Button onClick={props.onClose}>Close</Button>
      <Stack alignItems="center" direction="row" spacing={10}>
        <h4>Device ID: {props.device.id} </h4>
        <div>{props.IOTTrafficCurrent && <props.IOTTrafficCurrent deviceId={props.device.id}/>}</div>
      </Stack>
      {props.TableDevice && <props.TableDevice device={props.device}/>}
      {props.IOTTrafficHistory && <props.IOTTrafficHistory deviceId={props.device.id}/>}
      {props.device.deviceIdNo !== null && props.IOTTrafficPrediction && <props.IOTTrafficPrediction deviceIdNo={props.device.deviceIdNo}/>}
    </Box>
  )
};

export default DrawerContent;
