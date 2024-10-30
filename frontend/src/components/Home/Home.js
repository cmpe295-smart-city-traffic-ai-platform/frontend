import React, {
  Component,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import NavigationBar from "../Navbar/Navbar";
import axios from "axios";
import {
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
  APIProvider,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import iotImage from "../../images/iotImage.png";
import cctvImage from "../../images/cctvImage.png";
import droneImage3 from "../../images/droneImage3.png";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
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
//In Progress: Confifure when user is trafficagent vs client agent

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
  const user_id = localStorage.getItem("user_id");

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
      //for iot service
      const device = iotDevices.find((iot) => iot.id === id);
      //for dashboard service
      //const device = allDevices.find((a) => a.deviceId === id);
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
    //for iot service
    [selectedId, iotDevices]
    //for dashboard service
    //[selectedId, allDevices]
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
    const device = iotDevices.find((iot) => iot.id === searchDevice);
    //for dashboard service
    //const device = allDevices.find((a) => a.deviceId === searchDevice);
    if (device) {
      //iot
      const marker = markerRefs.current[device.id];
      //dashboard
      //const marker = markerRefs.current[device.deviceId];
      
      //iot service
      onMarkerClick(device.id, marker);
      //dashboard
      //onMarkerClick(device.deviceId, marker);
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
  ///dashboard service backend
  /*
    useEffect(() => {
      const getAllDevicesData = async () => {
      try {
        const [response1, response2, response3] = await Promise.all([
          axios.get("http://localhost:8080/api/dashboard/iot"),
          axios.get("http://localhost:8080/api/dashboard/cctv"),
          axios.get("http://localhost:8080/api/dashboard/drone"),
        ]);

        const mergeAllDevices = [
          ...response1.data,
          ...response2.data,
          ...response3.data
        ]

        const formatedDevices = mergeAllDevices
          .sort((a, b) => b.latitude - a.latitude)
          .map((dataItem, index) => ({ ...dataItem, zIndex: index }));
        setAllDevices(formatedDevices);
        setZIndexSelected(formatedDevices.length);
        setZIndexHover(formatedDevices.length + 1);
        console.log(formatedDevices)
      } catch (error) {
        console.error("Error getting the IoT Devices");
      }
    };
    getAllDevicesData();
    
    
    //setAllDevices([...iotDevices, ...cctvDevices, ...droneDevices]);
    //    console.log(allDevices);
        }, []);
      */
  ///IOT SESRVICE BACKEND
      
  useEffect(() => {
    const getDevices = async () => {
      try {
        //get devices from user
        const userId = "d04b59ff-4baf-47e2-986b-7a7d3e73091e";
        //const userId2 = "e17c8a2d-5c3b-4f1a-9b6d-8c8d4f8a2b1e";
        const response = await axios.get("http://localhost:8080/api/v1/iot", {
          params: {
            userId: userId,
          },
        });
        const formatedDevices = response.data
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
        
        setIotDevices(formatedDevices);
        setZIndexSelected(formatedDevices.length);
        setZIndexHover(formatedDevices.length + 1);
      } catch (error) {
        console.error("Error getting the IoT Devices");
      }
    };
    //getDevices();
    //GET PREDICTION DEVICES
    const getPredictionDevices = async() => {
      try{
        const response = await axios.get("http://localhost:8080/api/v1/iot/predictionDevices");
        const formatedDevices = response.data
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
        
        setIotDevices(formatedDevices);
        setZIndexSelected(formatedDevices.length);
        setZIndexHover(formatedDevices.length + 1);
      } catch{
        console.error("Error getting the IoT PREDICTION Devices");
      }
    };
    //TEST USING PREDICTION DEVICES ONLY
    getPredictionDevices();
  }, []);
  
  if(user_id == null)
    window.location = "/login"; 

  //IOT SERVICE TESTING
  return (
    <div>
      <h1>Home Page</h1>
      <Stack alignItems="center" direction="row" spacing={60}>
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
              <FormControlLabel
                checked={selectedValue === 'd'}
                onChange={handleRadioValueChange}              
                value="d"              
                label="ALL"              
                color = "secondary"              
                control={<Radio sx={{
                  
                  '&.Mui-checked': {
                    color: red[600],
                  },
                }}/>}                            
              />
            </RadioGroup>
          </FormLabel>
      </FormControl>
      {selectedValue}
    </Stack>
      <APIProvider
        apiKey={""}
        libraries={["marker"]}
      >
        <Map
          mapId={""}
          style={{ width: "100vw", height: "80vh" }}
          defaultCenter={{ lat: 37.33548, lng: -121.893028 }}
          defaultZoom={12}
          gestureHandling={"greedy"}
          disableDefaultUI
          onClick={onMapClick}
        >
          {iotDevices.map((iot, index) => {
            let zIndex = iot.zIndex;

            if (hoverId === iot.id) {
              zIndex = zIndexHover;
            }
            if (selectedId === iot.id) {
              zIndex = zIndexSelected;
            }
            return (
              <AdvancedMarkerWithRef
                key={iot.id}
                zIndex={zIndex}
                id={iot.id}
                setMarkerRef={setMarkerRef}
                className="custom-maker"
                position={{ lat: iot.latitude, lng: iot.longitude }}
                onMarkerClick={(marker) =>
                  onMarkerClick(iot.id, markerRefs.current[iot.id])
                }
                onMouseEnter={() => onMouseEnter(iot.id)}
                onMouseLeave={onMouseLeave}
                style={{
                  transform: `scale(${
                    [hoverId, selectedId].includes(iot.id) ? 1.4 : 1
                  })`,
                }}
              >
                {iot.active.toString() === "true" ? (
                  <Pin
                    background={"#03AC13"}
                    glyphColor={"#000"}
                    borderColor={"#000"}
                  />
                ) : (
                  <Pin
                    background={"#6F7378"}
                    glyphColor={"#000"}
                    borderColor={"#000"}
                  />
                )}
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
                <p>Location: {selectedDevice.location}</p>
                <p>Active: {selectedDevice.active.toString()}</p>
                <div><IOTTrafficCurrent deviceId={selectedDevice.id}/></div>
                <DashboardDrawer device={selectedDevice}/>
              </Box>

            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

//DASHBOARD TESTING
/*
return (
  <div>
    <h1>Home Page</h1>
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
    {deviceName}
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
            <FormControlLabel
              checked={selectedValue === 'd'}
              onChange={handleRadioValueChange}              
              value="d"              
              label="ALL"              
              color = "secondary"              
              control={<Radio sx={{
                
                '&.Mui-checked': {
                  color: red[600],
                },
              }}/>}                            
            />
          </RadioGroup>
        </FormLabel>
    </FormControl>
    {selectedValue}
    <APIProvider
      apiKey={""}
      libraries={["marker"]}
    >
      <Map
        mapId={""}
        style={{ width: "80vw", height: "80vh" }}
        defaultCenter={{ lat: 37.33548, lng: -121.893028 }}
        defaultZoom={12}
        gestureHandling={"greedy"}
        disableDefaultUI
        onClick={onMapClick}
      >
        {allDevices.map((device, index) => {
          let zIndex = device.zIndex;

          if (hoverId === device.deviceId) {
            zIndex = zIndexHover;
          }
          if (selectedId === device.deviceId) {
            zIndex = zIndexSelected;
          }
          return (
            <AdvancedMarkerWithRef
              key={device.deviceId}
              zIndex={zIndex}
              id={device.deviceId}
              setMarkerRef={setMarkerRef}
              className="custom-maker"
              position={{ lat: device.latitude, lng: device.longitude }}
              onMarkerClick={(marker) =>
                onMarkerClick(device.deviceId, markerRefs.current[device.deviceId])
              }
              onMouseEnter={() => onMouseEnter(device.deviceId)}
              onMouseLeave={onMouseLeave}
              style={{
                transform: `scale(${
                  [hoverId, selectedId].includes(device.deviceId) ? 1.4 : 1
                })`,
              }}
            >
              {device.isActive.toString() === "true" ? (
                <Pin
                  background={"#03AC13"}
                  glyphColor={"#000"}
                  borderColor={"#000"}
                />
              ) : (
                <Pin
                  background={"#6F7378"}
                  glyphColor={"#000"}
                  borderColor={"#000"}
                />
              )}
            </AdvancedMarkerWithRef>
          );
        })}
        {infoWindowShown && selectedMarker && selectedDevice && (
          <InfoWindow
            anchor={selectedMarker}
            onCloseClick={handleInfowindowCloseClick}
          >
            <h2>Name: {selectedDevice.name}</h2>
            <p>ID: {selectedDevice.deviceId}</p>
            <p>Location: {selectedDevice.latitude}, {selectedDevice.longitude}</p>
            <p>Status: {selectedDevice.isActive.toString()}</p>
            <p>Created: {selectedDevice.createdAt}</p>
          </InfoWindow>
        )}
        
      </Map>
    </APIProvider>
  </div>
);
}; */
export default Home;
