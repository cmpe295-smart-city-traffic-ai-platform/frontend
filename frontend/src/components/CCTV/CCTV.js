import { React, useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Table from 'react-bootstrap/Table';
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import AddIcon from '@mui/icons-material/Add';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Col from "react-bootstrap/esm/Col";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Image from 'react-bootstrap/Image';
import axios from "axios";
import cctvImage from "../../images/cctvImage.png";
//import { FaCamera } from "react-icons/fa"; // Import the camera icon

const CCTV = () => {
    const [show, setShow] = useState(false);
    const [cctvDevices, setCctvDevices] = useState([]);
    const [userId, setUserId] = useState(localStorage.getItem("user_id"));

    const [deviceName, setDeviceName] = useState("");
    const [deviceId, setDeviceId] = useState("");  // Add this state for deviceId
    const [deviceLocation, setDeviceLocation] = useState("");
    const [deviceAddress, setDeviceAddress] = useState("");
    const [deviceCounty, setDeviceCounty] = useState("");
    const [deviceCity, setDeviceCity] = useState("");
    const [streamingVideoURL, setStreamingVideoURL] = useState("");
    const [deviceActive, setDeviceActive] = useState(true);
    const [currentDeviceId, setCurrentDeviceId] = useState(null);  // To store current device ID for editing

    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    //const BASE_URL = "http://localhost:8080"; // Backend API base URL

    // Handlers for form input changes
    const handleDeviceNameChange = (event) => setDeviceName(event.target.value);
    const handleDeviceIdChange = (event) => setDeviceId(event.target.value);  // Update the state with the new device ID
    
    
    const handleDeviceLocationChange = (event) => setDeviceLocation(event.target.value);
    const handleDeviceAddressChange = (event) => setDeviceAddress(event.target.value);
    const handleDeviceCountyChange = (event) => setDeviceCounty(event.target.value);
    const handleDeviceCityChange = (event) => setDeviceCity(event.target.value);
    const handleStreamingVideoURLChange = (event) => setStreamingVideoURL(event.target.value);
    const handleDeviceActiveChange = () => setDeviceActive(!deviceActive);

    // Modal methods
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Fetch devices from backend
    const getDevices = async () => {
        try {
            //const response = await axios.get(`${BASE_URL}/api/cctvs/active`);
            const response = await axios.get(`/api/cctvs/my-devices/${userId}`);
            setCctvDevices(response.data);
        } catch (error) {
            console.error("Error fetching CCTV devices: ", error);
        }
    };

    // Create a new device
    const createCctvDevice = async () => {
        try {
            const response = await axios.post(`/api/cctvs/add`, {
                deviceId: deviceId,
                name: deviceName,
                location: deviceLocation,
                address: deviceAddress,
                county: deviceCounty,
                city: deviceCity,
                streamingVideoURL: streamingVideoURL,
                userId: userId,
                active: deviceActive,
            });
            setSuccessMessage("CCTV device created successfully!");
            setShowSuccessAlert(true);
            handleClose();
            getDevices();
        } catch (error) {
            console.error("Error creating CCTV device: ", error);
            setErrorMessage("Failed to create CCTV device.");
            setShowErrorAlert(true);
        }
    };

    // Edit a CCTV device
    const editCctvDevice = (device) => {
        setDeviceName(device.name);
        setDeviceLocation(device.location);
        setDeviceAddress(device.address);
        setDeviceCounty(device.county);
        setDeviceCity(device.city);
        setStreamingVideoURL(device.streamingVideoURL);
        setDeviceActive(device.active);
        setCurrentDeviceId(device.id); // Store the current device id
        setShow(true); // Show the modal
    };

// Update a CCTV device
const updateCctvDevice = async () => {
    if (!currentDeviceId) return;  // Make sure the device ID exists

    const updatedDeviceData = {
        deviceId: deviceId,  // Use deviceId here instead of currentDeviceId
        name: deviceName,
        location: deviceLocation,
        address: deviceAddress,
        county: deviceCounty,
        city: deviceCity,
        streamingVideoURL: streamingVideoURL,
        active: deviceActive,
    };

    console.log("Updating device with ID:", currentDeviceId);
    console.log("Updated data:", updatedDeviceData);

    try {
        const response = await axios.put(`/api/cctvs/${currentDeviceId}`, updatedDeviceData);
        console.log("Update response:", response.data);
        setSuccessMessage("CCTV device updated successfully!");
        setShowSuccessAlert(true);
        setShow(false); // Close the modal
        getDevices(); // Refresh device list
    } catch (error) {
        console.error("Error updating CCTV device:", error);
        setErrorMessage("Failed to update CCTV device.");
        setShowErrorAlert(true);
    }
};


    // Delete a CCTV device
    const deleteCctvDevice = async (id) => {
        console.log("Deleting device with ID:", id);
        try {
            const response = await axios.delete(`/api/cctvs/${id}`);
            console.log("Delete response:", response.data);
            setSuccessMessage("CCTV device deleted successfully!");
            setShowSuccessAlert(true);
            getDevices(); // Refresh the devices list
        } catch (error) {
            console.error("Error deleting CCTV device:", error);
            setErrorMessage("Failed to delete CCTV device.");
            setShowErrorAlert(true);
        }
    };

    // Format date for display
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    // Fetch devices on component load
    useEffect(() => {
        getDevices();
    }, []);

    return (
        <Container fluid="lg">
            <Row className="mt-3 mb-3">
                <Col align="left">
                    <h2>CCTV Station Management</h2>
                    <Image src={cctvImage} roundedCircle width={100} height={100} />
                </Col>
            </Row>

            <Row className="mt-3 mb-3">
                <Col align="left">
                    <Button variant="success" onClick={handleShow}>
                        <AddIcon /> Create CCTV Device
                    </Button>
                </Col>
            </Row>

            <Row className="mt-3 mb-3">
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>CCTV</th>
                                <th>Device ID</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Address</th>
                                <th>County</th>
                                <th>City</th>
                                <th>Streaming URL</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Active</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cctvDevices.map((device) => (
                                <tr key={device.id}>
                                    <td><Image src={cctvImage} roundedCircle width={50} height={50} /> {/* CCTV Camera Image */}</td>
                                    <td>{device.deviceId}</td>
                                    <td>{device.name}</td>
                                    <td>{device.location}</td>
                                    <td>{device.address}</td>
                                    <td>{device.county}</td>
                                    <td>{device.city}</td>
                                    <td>{device.streamingVideoURL}</td>
                                    <td>{dateFormatter.format(new Date(device.createdAt))}</td>
                                    <td>{dateFormatter.format(new Date(device.updatedAt))}</td>
                                    <td>{device.active ? "Yes" : "No"}</td>
                                    <td>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => editCctvDevice(device)}
                                        >
                                            <FaEdit /> 
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => deleteCctvDevice(device.id)}
                                        >
                                            <FaTrash /> 
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Modal for Create/Update CCTV Device */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentDeviceId ? "Update CCTV Device" : "Create CCTV Device"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Device name" 
                                value={deviceName} 
                                onChange={handleDeviceNameChange} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Device ID</Form.Label>
                            <Form.Control 
                                type="number"  // Device ID is often an integer or UUID, update type accordingly
                                placeholder="Enter device ID"
                                value={deviceId}  // Bind the value to the state variable
                                onChange={handleDeviceIdChange}  // Handle change to update state
                            />
                         </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label> <LocationOnIcon />
                            <Form.Control 
                                type="text" 
                                placeholder="(e.g. 37.417981,-121.972547)" 
                                value={deviceLocation} 
                                onChange={handleDeviceLocationChange} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Device address" 
                                value={deviceAddress} 
                                onChange={handleDeviceAddressChange} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>County</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Device county" 
                                value={deviceCounty} 
                                onChange={handleDeviceCountyChange} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Device city" 
                                value={deviceCity} 
                                onChange={handleDeviceCityChange} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Streaming URL</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Streaming video URL" 
                                value={streamingVideoURL} 
                                onChange={handleStreamingVideoURLChange} 
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Check 
                                type="checkbox" 
                                label="Active" 
                                checked={deviceActive} 
                                onChange={handleDeviceActiveChange} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button 
                        variant="primary" 
                        onClick={currentDeviceId ? updateCctvDevice : createCctvDevice}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Success and Error Toasts */}
            <ToastContainer position="bottom-end">
                <Toast className="m-3 text-white" bg="success" onClose={() => setShowSuccessAlert(false)} show={showSuccessAlert} delay={3000} autohide>
                    {successMessage}
                </Toast>
            </ToastContainer>

            <ToastContainer position="bottom-end">
                <Toast className="m-3 text-white" bg="danger" onClose={() => setShowErrorAlert(false)} show={showErrorAlert} delay={3000} autohide>
                    {errorMessage}
                </Toast>
            </ToastContainer>
        </Container>
    );
};

export default CCTV;
