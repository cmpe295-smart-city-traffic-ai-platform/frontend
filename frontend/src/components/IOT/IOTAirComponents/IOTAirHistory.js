import { React, useState, useEffect } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import { Container } from "@mui/material";
import Spinner from 'react-bootstrap/Spinner';
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";

const IOTAirHistory = (props) => {

    const [aqiValues, setAquiValues] = useState([]);
    const [timestampValues, setTimestampValues] = useState([]);
    const [coValues, setCoValues] = useState([]);
    const [no2Values, setNo2Values] = useState([]);
    const [ozoneValues, setOzoneValues] = useState([]);
    const [PM10Values, setPM10Values] = useState([]);
    const [PM25Values, setPM25Values] = useState([]);
    const [so2Values, setSo2Values] = useState([]);

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });

    const getAirDataHistory= async () => {
        try {
            console.log(props.deviceIdNo)
          const response = await axios.get(`/api/v1/airdata/device/${props.deviceIdNo}`);
          console.log(response) //localhost
          //console.log(response.data[0].airData)
          const aqi = []
          const t = []
          const co = []
          const no2= []
          const o3 = []
          const pm10 = []
          const pm25 = []
          const so2 = []
          //console.log(response.data)
          response.data.forEach(x => {
            if(x.airData !== "0"){
                const airData = JSON.parse(x.airData);
                const aqi1 = airData.indexes.find(index => index.code === 'uaqi').aqi;
                aqi.push(aqi1)
                const t1 = airData.dateTime;
                const t2 = dateFormatter.format(new Date(t1));
                t.push(t2)
                const a = airData.pollutants.find(pollutant => pollutant.code === 'co' ).concentration.value;
                co.push(a)
                const b = airData.pollutants.find(pollutant => pollutant.code === 'no2' ).concentration.value;
                no2.push(b)
                const c = airData.pollutants.find(pollutant => pollutant.code === 'o3' ).concentration.value;
                o3.push(c)
                const d = airData.pollutants.find(pollutant => pollutant.code === 'pm10' ).concentration.value;
                pm10.push(d)
                const e = airData.pollutants.find(pollutant => pollutant.code === 'pm25' ).concentration.value;
                pm25.push(e)
                const f = airData.pollutants.find(pollutant => pollutant.code === 'so2' ).concentration.value;
                so2.push(f) 
            }else{
                //In case airData is zero, skip and dont append data to lists
                //aqi.push(0);
                //const t1 = x.airDataTimeRetrived;
                //const t2 = dateFormatter.format(new Date(t1));
                //t.push(t2);
                //co.push(0);
                //no2.push(0);
                //o3.push(0);
                //pm10.push(0);
                //pm25.push(0);
                //so2.push(0);
            }
            
          })

          //const airdata = JSON.parse(response.data[0].airData);
          //console.log(airdata)
          //console.log(t)
          setAquiValues(aqi);
          setTimestampValues(t)
          setCoValues(co)
          setNo2Values(no2)
          setOzoneValues(o3)
          setPM10Values(pm10)
          setPM25Values(pm25)
          setSo2Values(so2)

        } catch (error) {
          console.error("Error getting air history for prediction device");
        }
    };

    useEffect(() => {
        getAirDataHistory();
    }, [props.deviceIdNo])
    return(
        <Container>
            <h5> Air Quality History Device ID No. {props.deviceIdNo} </h5>
            {aqiValues === undefined ? 
                <p>Error getting data</p>
                : aqiValues.length === 0 ?
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
                            scaleType: 'linear',
                        }
                    ]}
                    series={[
                        {
                            data: aqiValues, 
                            scaleType: "linear",
                            showMark: false,
                            label: "AQI"
                        },
                        {
                            data: coValues, 
                            scaleType: "linear",
                            showMark: false,
                            label: "CO (ppb)"
                        },
                        {
                            data: no2Values, 
                            scaleType: "linear",
                            showMark: false,
                            label: "NO2 (ppb)"
                        },
                        {
                            data: ozoneValues, 
                            scaleType: "linear",
                            showMark: false,
                            label: "OZONE (ppb)"
                        },
                        {
                            data: so2Values, 
                            scaleType: "linear",
                            showMark: false,
                            label: "SO2 (ppb)"
                        },
                        {
                            data: PM10Values, 
                            scaleType: "linear",
                            showMark: false,
                            label: "PM10 (µg/m³)"
                        },
                        {
                            data: PM25Values, 
                            scaleType: "linear",
                            showMark: false,
                            label: "PM25 (µg/m³)"
                        },
                    ]}
                    width={850}
                    height={500}
                    margin={{ top: 50, right: 20 }}
                    slotProps={{ legend: { hidden: true } }}
                    grid={{ horizontal: true }}
                    >

                </LineChart>
            }

        </Container>
    )
}

export default IOTAirHistory;