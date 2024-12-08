import React, {
  Component,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import axios from "axios";
import {
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
  APIProvider,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {red} from '@mui/material/colors';
import DashboardDrawer from "./Drawer/DashboardDrawer";
import IOTTrafficCurrent from "../IOT/IOTTrafficComponents/IOTTrafficCurrent";
import  Stack  from "@mui/material/Stack";
import Box from "@mui/material/Box";
import cctvData from './CCTVData.json';
import droneData from './DroneData.json';
import alertData from './AlertData.json';
import PinColor from "./Pin/PinColor";
import { Traffic } from "@mui/icons-material";

const AdvancedMarkerWithRef = (props) => {
  const { children, onMarkerClick, setMarkerRef, id, ...advancedMarkerProps } =
    props;
  const [markerRef, marker] = useAdvancedMarkerRef();

  useEffect(() => {
    if (marker) {
      setMarkerRef(marker, id);
    }
  }, [marker, setMarkerRef, id]);
  return (
    <AdvancedMarker
      onClick={() => {
        if (marker) {
          onMarkerClick(marker);
        }
      }}
      ref={markerRef}
      {...advancedMarkerProps}
    >
      {children}
    </AdvancedMarker>
  );
};

const Home = () => {
  //If not logged in, sent user to login page
  if (localStorage.getItem("user_id") === null){
    window.location = "/login"
  }

  //Homepage variables
  const [droneDevices, setDroneDevices] = useState([]);
  const [iotDevices, setIotDevices] = useState([]);
  const [cctvDevices, setCctvDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchDevice, setSearchDevice] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [allDevices, setAllDevices] = useState([]);
  const [selectedValue, setSelectedValue] = useState('a');
  const [predictionDevices, setPredictionDevices] = useState([]);

  //Google Map variables
  const [hoverId, setHoverId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [zIndexSelected, setZIndexSelected] = useState(null);
  const [zIndexHover, setZIndexHover] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const markerRefs = useRef({});
  const onMouseEnter = useCallback((id) => setHoverId(id), []);
  const onMouseLeave = useCallback(() => setHoverId(null), []);
  
  const onMarkerClick = useCallback(
    (id, marker) => {

      const device = allDevices.find((a) => a.id === id);
      setSelectedId(id);
      setSelectedDevice(device);
      if (marker) {
        setSelectedMarker(marker);
      }
      if (id !== selectedId) {
        setInfoWindowShown(true);
      } else {
        setInfoWindowShown((isShown) => !isShown);
      }
    },

    [selectedId, allDevices]
  );
  //when user clicks map, close any info windows
  const onMapClick = useCallback(() => {
    setSelectedId(null);
    setSelectedMarker(null);
    setInfoWindowShown(false);
  }, []);

  //used to close the infowindows
  const handleInfowindowCloseClick = useCallback(
    () => setInfoWindowShown(false),
    []
  );
  //used to store the device id to be searched
  const handleSearchChange = (event) => {
    setSearchDevice(event.target.value);
  };
  //only when submit is clicked, search for the the device
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setDeviceName(searchDevice);
    //for iot service
    //const device = iotDevices.find((iot) => iot.id === searchDevice);
    //for dashboard service
    const device = allDevices.find((a) => a.id === searchDevice);
    if (device) {
      //iot
      //const marker = markerRefs.current[device.id];
      //dashboard
      const marker = markerRefs.current[device.id];
      
      //iot service
      //onMarkerClick(device.id, marker);
      //dashboard
      onMarkerClick(device.id, marker);
    } else {
      alert("Device not found");
    }
  };

  const setMarkerRef = (marker, id) => {
    markerRefs.current[id] = marker;
  };

  const handleRadioValueChange = (event) => {
    setSelectedValue(event.target.value);
  };
      
  useEffect(() => {
    
    //GET DEVICES BASED ON RADIO BUTTON SELECTED
    const getDevices = async () => {
      try {
          let testData = [];
          let url = '';
          let url2 = '';
          let userId = localStorage.getItem("user_id")
          if (selectedValue === 'a'){ //IOT DEVICES
            url = '/api/v1/iot/predictionDevices';//IOT PREDICTION devices
            url2 = '/api/v1/iot';//DEVICES CREATED BY AGENT
            if(localStorage.getItem("role")=='traffic'){
              //fetch data and merge response to one list
              try{
                  const [response1, response2] = await Promise.all([
                                  axios.get(url),
                                  axios.get(url2, {
                                    params: {
                                      userId: userId,
                                    },
                                  }),
                                ]);
                                testData = [
                                  ...response1.data,
                                  ...response2.data,
                                ]
                                console.log(testData)
              } catch(error){
                  testData=[]//if error, set empty
              }
            }else{
              //CLIENT - RETURN ONLY PREDICT DEVICES
              try{
                  const response = await axios.get(url);
                  testData = response.data
              }catch(error){
                testData = []//if error, set empty
              }
            }
            
          } else if (selectedValue === 'b'){
            url = `/api/cctvs/my-devices/${userId}`;//CCTV API traffic agent
            url2 = '/api/cctvs/active';//client
            //Call pi based on role
            if(localStorage.getItem("role")=='traffic'){
              //TRAFFIC - RETURN ONLY DEVICES CREATED BY AGENT
              try{
                const response = await axios.get(url);
                console.log(response.data)
                testData = response.data.map(cctv => ({
                  id: cctv.id,
                  deviceId: cctv.deviceId,
                  name: cctv.name,
                  active: cctv.active,
                  location: cctv.location,
                  address: cctv.address,
                  county: cctv.county,
                  city: cctv.city,
                  url: cctv.streamingVideoURL,
                  createdAt: cctv.createdAt,
                  updatedAt: cctv.updatedAt
                }))
                console.log(testData)
              } catch(error){
                  testData=[]//if error, set empty
              }
            }else{
              //CLIENT - RETURN ONLY ACTIVE DEVICES
              try{
                  const response = await axios.get(url2);
                  console.log(response.data)
                  testData = response.data.map(cctv => ({
                    id: cctv.id,
                    deviceId: cctv.deviceId,
                    name: cctv.name,
                    active: cctv.active,
                    location: cctv.location,
                    address: cctv.address,
                    county: cctv.county,
                    city: cctv.city,
                    url: cctv.streamingVideoURL,
                    createdAt: cctv.createdAt,
                    updatedAt: cctv.updatedAt
                  }))
              }catch(error){
                testData = []//if error, set empty
              }
            } 
          } else if (selectedValue === 'c'){
            /// Connect to drone service
            //Client works, agent gives error
            url = 'https://100.26.248.255:5001/api/v1/droneScheduler/getdronesformap';//Drones API
            let r = (localStorage.getItem("role") === "client" ? "client" : "agent");
            console.log(r)
            try {
                  const response = await axios.post(url, {
                    firstname: localStorage.getItem("firstName"),
                    lastname: localStorage.getItem("lastName"),
                    email: localStorage.getItem("email"),
                    uuid: localStorage.getItem("user_id"),
                    password: localStorage.getItem("password"),
                    role: r 
                    })
                    //console.log(response.data)
                    //FORMAT RESPONSE
                    testData = response.data.map(drone => ({
                    id: drone.drone_id,
                    active: drone.drone_status === 'Active',
                    location: drone.location,
                    name: drone.drone_name
                  }))
                } catch(error){
                  testData = [];//if error, set empty
                }
              
          }else{
              url = '/api/v1/alert/generateAlerts';
              url2 = '/api/v1/alert/generateAlerts';//Alerts API
              /// //Modify once connected to ALERT SERVICE
              try{
                const response = await axios.get(url2)
                //const response = await axios.get(url2)
                testData = response.data
                //console.log(testData)
                //FORMAT RESPONSE
                testData = response.data.map(alert => ({
                  id: alert.id,
                  location: alert.location,
                  name: alert.type,
                  active: true,
                  message: alert.message,
                  severity: alert.severity
                }))
              } catch(error){
                  testData = [];//if error, set empty 
              }
            }
          //const response = await axios.get(url); //TEST PREDICTION IOT DEVICES
          //const response = await axios.get(url3);//TEST IOT SERVICE HOSTED ON CLOUD
          /*
          const response = await axios.get(url2, {
            params: {
              userId: userId,
            },
          });*////TEST DEVICES FOR SPECIFIC USER
          //testData =response.data///TEST DEVICES FOR SPECIFIC USER
          setAllDevices([]);
          if (testData && testData.length > 0){
            const formatedDevices = testData
            .map((item) => {
              const [lat, long] = item.location
                .replace("location:", "")
                .split(",");
              return {
                ...item,
                latitude: parseFloat(lat),
                longitude: parseFloat(long),
              };
            })
            .sort((a, b) => b.latitude - a.latitude)
            .map((dataItem, index) => ({ ...dataItem, zIndex: index }));
          setAllDevices(formatedDevices);
          setZIndexSelected(formatedDevices.length);
          setZIndexHover(formatedDevices.length + 1);
      } else {
        //CASE WHERE RETRIVED DATA IS EMPTY
        setAllDevices([]);//
        setZIndexHover(0);
        setZIndexHover(0);
      }
      } catch (error) {
        console.error("Error getting the Selected Devices");
      }
    };
    getDevices(); 
    

  }, [selectedValue]);
   
  //Use memo so page does not re-render 
  const memoDevices = useMemo(() => allDevices, [allDevices]);
  //IOT SERVICE TESTING
  return (
    <div>
      <h3>Dashboard</h3>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '10vh', 
          }} 
          >
      <Stack  direction="row" spacing={20}>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
            borderRadius: 28,
          }}
          onSubmit={handleSearchSubmit}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Device"
            inputProps={{ "aria-label": "search device google maps" }}
            onChange={handleSearchChange}
          />
          <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        
        <FormControl>
          <FormLabel id="select-device-radio-buttons-group-label">
            <RadioGroup
              row
              aria-labelledby="select-device-radio-buttons-group-label"
              name="select-device-radio-button-group"
            >
              <FormControlLabel 
                checked={selectedValue === 'a'}
                onChange={handleRadioValueChange}
                value="a"
                label="IOT STATIONS"
                color = "primary"
                control={<Radio />}  
              />
              <FormControlLabel
                checked={selectedValue === 'b'}
                onChange={handleRadioValueChange}              
                value="b"              
                label="CCTV"              
                            
                control={<Radio color = "secondary"/>}                            
              />
              <FormControlLabel
                checked={selectedValue === 'c'}
                onChange={handleRadioValueChange}              
                value="c"              
                label="DRONES"                          
                control={<Radio color="success"/>}                            
              />
              {localStorage.getItem("role")==="client" ? 
              <FormControlLabel
                checked={selectedValue === 'd'}
                onChange={handleRadioValueChange}              
                value="d"              
                label="ALERTS"              
                color = "secondary"              
                control={<Radio sx={{
                  
                  '&.Mui-checked': {
                    color: red[600],
                  },
                }}/>}                            
              /> :
                <p></p>
               }
            </RadioGroup>
          </FormLabel>
      </FormControl>
    </Stack>
    </Box>
      <APIProvider
        apiKey={""}
        libraries={["marker"]}
      >
        <Map
          mapId={""}
          style={{ width: "auto", height: "70vh" }}
          defaultCenter={{ lat: 37.33548, lng: -121.893028 }}
          defaultZoom={12}
          gestureHandling={"greedy"}
          disableDefaultUI
          onClick={onMapClick}
        >
          {memoDevices.map((device, index) => {
            let zIndex = device.zIndex;

            if (hoverId === device.id) {
              zIndex = zIndexHover;
            }
            if (selectedId === device.id) {
              zIndex = zIndexSelected;
            }
            return (
              <AdvancedMarkerWithRef
                key={device.id}
                zIndex={zIndex}
                id={device.id}
                setMarkerRef={setMarkerRef}
                className="custom-maker"
                position={{ lat: device.latitude, lng: device.longitude }}
                onMarkerClick={(marker) =>
                  onMarkerClick(device.id, markerRefs.current[device.id])
                }
                onMouseEnter={() => onMouseEnter(device.id)}
                onMouseLeave={onMouseLeave}
                style={{
                  transform: `scale(${
                    [hoverId, selectedId].includes(device.id) ? 1.4 : 1
                  })`,
                }}
              >
                <PinColor deviceId={device.id} active={device.active} type={selectedValue} severity={device.severity}/>
              </AdvancedMarkerWithRef>
            );
          })}
          {infoWindowShown && selectedMarker && selectedDevice && (
            <InfoWindow
              anchor={selectedMarker}
              onCloseClick={handleInfowindowCloseClick}
            >
              <Box 
                alignItems="center"
                display="flex"
                justifyContent="center"
                flexDirection="column"
              >
                <h2>Name: {selectedDevice.name}</h2>
                <p>ID: {selectedDevice.id}</p>
                {selectedValue==='d' &&
                  <p>{selectedDevice.message}</p>//display alert message
                }
                <p>Location: {selectedDevice.location}</p>
                {selectedValue!=='d' &&
                  <p>Active: {selectedDevice.active.toString()}</p>//display only for devices that are not alerts
                }
                
                {selectedValue==='a' &&
                  <div><IOTTrafficCurrent deviceId={selectedDevice.id}/></div>//display speed for iot
                }
                <DashboardDrawer device={selectedDevice} type={selectedValue}/>
              </Box>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

export default Home;
