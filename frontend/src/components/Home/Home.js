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


/*
export const AdvancedMarkerWithRef = (props) => {
  const { children, onMarkerClick, ...advancedMarkerProps } = props;
  const [markerRef, marker] = useAdvancedMarkerRef();

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
*/

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
      const device = iotDevices.find((iot) => iot.id === id);

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
    [selectedId, iotDevices]
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

    const device = iotDevices.find((iot) => iot.id === searchDevice);
    if (device) {
      //setSelectedId(device.id)
      //setSelectedDevice(device)
      //setSelectedMarker(markerRefs.current[device.id])
      //setInfoWindowShown(true);

      //console.log("Refs",markerRefs)
      const marker = markerRefs.current[device.id];
      //console.log("Marker: ",marker)
      onMarkerClick(device.id, marker);
    } else {
      alert("Device not found");
    }
  };

  const setMarkerRef = (marker, id) => {
    markerRefs.current[id] = marker;
  };
  /*
    useEffect(() => {
        ///get users 
        
        axios.get("http://localhost:8080/api/dashboard/users")
            .then((res)=> {
                console.log(res.data);
                setUsers(res.data);
                }).catch(error => {
                console.error('Error getting users', error);
               });
        
        //get drones 
        axios.get("http://localhost:8080/api/dashboard/drone")
            .then((res)=> {
                console.log(res.data);
                setDroneDevices(res.data);
                }).catch(error => {
                console.error('Error getting drones', error);
               });
         
        //get iot 
        axios.get("http://localhost:8080/api/dashboard/iot")
            .then((res)=> {
                console.log(res.data);
                setIotDevices(res.data);
                }).catch(error => {
                console.error('Error getting iot devices', error);
               });
         
        //get cctv 
        axios.get("http://localhost:8080/api/dashboard/cctv")
            .then((res)=> {
                console.log(res.data);
                setCctvDevices(res.data);
                }).catch(error => {
                console.error('Error getting users', error);
               });
        
        }, []);*/
  useEffect(() => {
    const getDevices = async () => {
      try {
        const userId = "d04b59ff-4baf-47e2-986b-7a7d3e73091e";
        const userId2 = "e17c8a2d-5c3b-4f1a-9b6d-8c8d4f8a2b1e";
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
    getDevices();
  }, []);

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
          {iotDevices.map((iot, index) => {
            let zIndex = iot.zIndex;

            if (hoverId === iot.id) {
              zIndex = zIndexHover;
            }
            if (selectedId === iot.id) {
              zIndex = zIndexSelected;
            }
            return (
              /*
            <AdvancedMarkerWithRef
              key={iot.id}
              iot={iot}
              zIndex={zIndex}
              onMarkerClick={onMarkerClick}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              hoverId={hoverId}
              selectedId={selectedId}
            />*/
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
                    background={"#FBBC04 "}
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
              <p>ID: {selectedDevice.id}</p>
              <p>Location: {selectedDevice.location}</p>
              <p>Created By: {selectedDevice.userId}</p>
              <p>Status: {selectedDevice.active.toString()}</p>
              <p>Created: {selectedDevice.createdAt}</p>
            </InfoWindow>
          )}
          {/*
            {iotDevices.map((iot, index) => {

            let zIndex = iot.zIndex;

            if(hoverId === iot.id){
              zIndex = zIndexHover;
            }
            if (selectedId === iot.id){
              zIndex = zIndexSelected;
            }
            return ( <>
            <AdvancedMarkerWithRef
              key={iot.id}
              zIndex={zIndex}
              className="custom-maker"
              position={{ lat: iot.latitude, lng: iot.longitude }}
              onMarkerClick={(marker) => onMarkerClick(iot.id, marker)}  
              onMouseEnter={() => onMouseEnter(iot.id)}
              onMouseLeave={onMouseLeave}
              style={{
                transform: `scale(${[hoverId, selectedId].includes(iot.id) ? 1.4 : 1})`
              }}
            >
              {iot.active.toString() === "true" ? (
                <Pin
                  background={"#FBBC04 "}
                  glyphColor={"#000"}
                  borderColor={"#000"}
                />
              ) : (
                <Pin
                  background={"#C68A00"}
                  glyphColor={"#000"}
                  borderColor={"#000"}
                />
              )}
            </AdvancedMarkerWithRef>
            </>
            )
          })}
          {infoWindowShown && selectedMarker && selectedDevice &&(
          <InfoWindow
            anchor={selectedMarker}
            onCloseClick={handleInfowindowCloseClick}>
            <h2>Name: {selectedDevice.name}</h2>
            <p>ID: {selectedDevice.id}</p>
            <p>Location: {selectedDevice.location}</p>
            <p>Created By: {selectedDevice.userId}</p>
            <p>Status: {selectedDevice.active.toString()}</p>
            <p>Created: {selectedDevice.createdAt}</p>
          </InfoWindow>
        )}
           */}
          {/*/
          
                {iotDevices.map((iot, index) => (
                    <AdvancedMarker
                        key={index}
                        clickable={true}
                        position={{lat: iot.latitude ,lng: iot.longitude}}>
                        <img src={iotImage} width={35} height={35} />  
                    </AdvancedMarker>
                ))}
                {cctvDevices.map((cctv, index) => (
                    <AdvancedMarker
                        key={index}
                        clickable={true}
                        position={{lat: cctv.latitude ,lng: cctv.longitude}}>
                            <img src={cctvImage} width={35} height={35} />       
                    </AdvancedMarker>
                ))}   
                {droneDevices.map((drone, index) => (
                    <AdvancedMarker
                        key={index}
                        clickable={true}
                        position={{lat: drone.latitude ,lng: drone.longitude}}>
                            <img src={droneImage3} width={70} height={70} />
                    </AdvancedMarker>
                ))}
                
                */}
        </Map>
      </APIProvider>

      <h2>IOT Devices</h2>
      {iotDevices.length === 0 ? (
        <p>NO IOT DEVICES</p>
      ) : (
        <table>
          <tr>
            <th>Device ID</th>
            <th>Device Number</th>
            <th>Name</th>
            <th>location</th>
            <th>Created By </th>
            <th>Active</th>
            <th>Created At</th>
          </tr>
          {iotDevices.map((iot, index) => (
            <tr key={index}>
              <td>{iot.id}</td>
              <td>{iot.deviceIdNo}</td>
              <td>{iot.name}</td>
              <td>{iot.location}</td>
              <td>{iot.userId}</td>
              <td>{iot.active.toString()}</td>
              <td>{iot.createdAt}</td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
};

export default Home;
