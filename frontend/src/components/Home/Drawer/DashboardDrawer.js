import {React, useState} from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IOTTrafficHistory from '../../IOT/IOTTrafficComponents/IOTTrafficHistory';
import IOTTrafficPrediction from '../../IOT/IOTTrafficComponents/IOTTrafficPrediction';
import DrawerContent from './DrawerContent';
const DashboardDrawer = (props) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>View Traffic Data</Button>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor={'right'}>
        <DrawerContent 
         deviceId = {props.deviceId} 
         deviceIdNo = {props.deviceIdNo} 
         onClose = {toggleDrawer(false)}
         IOTTrafficHistory = {IOTTrafficHistory}
         IOTTrafficPrediction ={IOTTrafficPrediction}
         />
      </Drawer>
    </div>
  );
}
export default DashboardDrawer;