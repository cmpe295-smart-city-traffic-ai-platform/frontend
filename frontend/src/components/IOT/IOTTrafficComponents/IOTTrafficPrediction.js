import { React, useState, useEffect } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import { Container } from "@mui/material";
import Spinner from 'react-bootstrap/Spinner';

const IOTTrafficPrediction = (props) => {
    // use props.deviceIdNo, pass in deviceIdNo from parent component (e.g. when clicked on in map)
    // const [deviceIdNo, setDeviceIdNo] = useState("402059");
    const [speedPredictionValues, setSpeedPredictionValues] = useState([]);
    const [timestampValues, setTimestampValues] = useState([]);
    const getTrafficPrediction= async () => {
        try {
          const response = await axios.get(`/api/v1/iot/traffic/predictions/${props.deviceIdNo}`);
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
            <h4> Traffic Speed Prediction Device ID No. {props.deviceIdNo} </h4>
            {speedPredictionValues.length === 0 ? 
                <Spinner
                    as="span"
                    animation="border"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                /> 
                :
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
                            showMark: false,
                            label: "MPH"
                        },
                    ]}
                    width={1200}
                    height={500}
                />
            }

        </Container>
    )
}

export default IOTTrafficPrediction;