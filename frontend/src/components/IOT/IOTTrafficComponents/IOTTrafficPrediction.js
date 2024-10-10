import { React, useState, useEffect } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import { Container } from "@mui/material";

const IOTTrafficPrediction = (props) => {
    const [deviceIdNo, setDeviceIdNo] = useState("400292");
    const [speedPredictionValues, setSpeedPredictionValues] = useState([]);
    const [timestampValues, setTimestampValues] = useState([]);
    const getTrafficPrediction= async () => {
        try {
          const response = await axios.get(`/api/v1/iot/traffic/predictions/${deviceIdNo}`);
          const trafficPredictionData = response.data;
          setSpeedPredictionValues(trafficPredictionData.speedPredictionValues);
          setTimestampValues(trafficPredictionData.predictionTimestamps);
        } catch (error) {
          console.error("Error getting traffic prediction");
        }
    };

    useEffect(() => {
        getTrafficPrediction();
    }, [])
    return(
        <Container>
            <h4> Traffic Speed Prediction </h4>
            <LineChart
                xAxis={[
                    { 
                        data: timestampValues, 
                        scaleType: "point",
                        label: "Timestamp"
                    }
                ]}
                yAxis={[
                    {
                        min: 0,
                        label: 'Speed (MPH)',
                        scaleType: 'linear'
                    }
                ]}
                series={[
                    {
                        data: speedPredictionValues, 
                        scaleType: "linear",
                        color: 'orange',
                        showMark: false
                    },
                ]}
                width={1200}
                height={500}
            />
        </Container>

    )
}

export default IOTTrafficPrediction;