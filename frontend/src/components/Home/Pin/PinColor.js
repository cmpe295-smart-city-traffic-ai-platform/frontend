import { React, useState, useEffect } from "react";
import axios from 'axios';
import { Container } from "@mui/material";
import Spinner from 'react-bootstrap/Spinner';
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Pin } from "@vis.gl/react-google-maps";

const PinColor = (props) => {
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const getCurrentTraffic = async () => {
        try {
          const response = await axios.get(`/api/v1/iot/traffic/${props.deviceId}`);
          const trafficResults = JSON.parse(response.data.trafficData);
          setCurrentSpeed(trafficResults.flowSegmentData.currentSpeed);
        } catch (error) {
          console.error("Error getting current traffic data for selected device");
        }
    };
    useEffect(() => {
        getCurrentTraffic();
    }, [props.deviceId, props.type])

    const getSpeedColor = (speed) => {
        if(speed >= 0 && speed <= 10) return '#e60000';//severe traffic red
        if(speed > 10 && speed <= 25) return '#f07d02'//normal traffic orange
        if(speed > 25 && speed <= 60) return '#ffff00';//light traffic yellow
        return '#87cb54' //no traffic green
    }
    if(props.active.toString() === "false"){
        return(
            <Pin
                background={"#6F7378"}
                glyphColor={"#000"}
                borderColor={"#000"}
            />
        )
    }else if(props.type === 'a'){
        return(
            <Pin
                background= {getSpeedColor(currentSpeed)}
                glyphColor={"#000"}
                borderColor={"#000"}
            />
    
        )
    }else{
        return(
            <Pin
                background= {"#03AC13"}
                glyphColor={"#000"}
                borderColor={"#000"}
            />
    
        )
    }
}

export default PinColor;