import { React, useState, useEffect } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import { Container } from "@mui/material";
import Spinner from 'react-bootstrap/Spinner';

const IOTTrafficHistory = (props) => {
    // TODO use device id passed to component
    const [deviceId, setDeviceId] = useState("b1a79cb2-dfb8-4680-9ebb-3604fd37db85");
    const [speedHistoryValues, setSpeedHistoryValues] = useState([]);
    const [timestampHistoryValues, setTimestampHistoryValues] = useState([]);
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
    const getTrafficHistory = async () => {
        try {
          const response = await axios.get(`/api/v1/iot/traffic/history/${deviceId}`, {
            params: {
              limit: 200
            },
          });
          const trafficResults = response.data;
          const formattedTrafficResults = trafficResults.map(result => {
            return {
                speed: JSON.parse(result.trafficData).flowSegmentData.currentSpeed,
                timestamp: dateFormatter.format(new Date(result.createdAt))
            }
          })
          setSpeedHistoryValues(formattedTrafficResults.map(data => data.speed));
          setTimestampHistoryValues(formattedTrafficResults.map(data => data.timestamp))
        } catch (error) {
          console.error("Error getting traffic history");
        }
    };

    useEffect(() => {
        getTrafficHistory();
    }, [])
    return(
        <Container>
            <h4> Traffic Speed History Device ID {deviceId} </h4>
            {speedHistoryValues.length == 0 ?         
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
                            data: timestampHistoryValues, 
                            scaleType: "point",
                            label: "Timestamp"
                        }
                    ]}
                    yAxis={[
                        {
                        min: 0,
                        label: 'Speed (MPH)',
                        scaleType: 'linear',
                        }
                    ]}
                    series={[
                        {
                            data: speedHistoryValues, 
                            scaleType: "linear",
                            showMark: false,
                            color: "blue",
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

export default IOTTrafficHistory;