import { React, useState, useEffect } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import { Container } from "@mui/material";

const IOTTrafficHistory = (props) => {
    const [deviceId, setDeviceId] = useState("c689028b-6fb0-40f1-81cd-dd29e7f9420d");
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
            <h4> Traffic Speed History </h4>
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
                        showMark: false
                    },
                ]}
                width={1200}
                height={500}
            />
        </Container>

    )
}

export default IOTTrafficHistory;