import { React, useState } from "react";
import CircleIcon from '@mui/icons-material/Circle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

// modal reference: https://react-bootstrap.netlify.app/docs/components/modal
const IOTDevice = (props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const toggleActiveStatus = async () => {
        try {
            const response = await axios.put(`/api/v1/iot/${props.userId}/${props.deviceId}`, {
                active: !props.active,
                name: null,
                location: null
            });
            console.log(response);
            console.log(`Device ID ${props.deviceId} updated successfully`);
            props.getDevices();
        } catch (error) {
            console.error(`"Error updating active status: ${error}`);
        }
    }

    const deleteIotDevice = async () => {
        try {
            const response = await axios.delete(`/api/v1/iot/${props.userId}/${props.deviceId}`);
            console.log(response);
            console.log(`Device ID ${props.deviceId} deleted successfully`);
            props.getDevices();
        } catch (error) {
            console.error(`"Error deleting IOT device: ${error}`);
        }
    }

    return(
        <>
            <tr>
                <td>{props.deviceId}</td>
                <td>{props.name}</td>
                <td>{props.location}</td>
                <td>{props.createdAt}</td>
                <td>{props.updatedAt}</td>
                <td>{props.active ? <CircleIcon sx={{color: "green", cursor: "pointer"}} onClick={toggleActiveStatus}/> : <CircleIcon sx={{color: "red" , cursor: "pointer"}} onClick={toggleActiveStatus}/>}</td>
                <td><EditIcon onClick={handleShow} sx={{cursor: "pointer"}}/></td>
                <td><DeleteIcon sx={{cursor: "pointer"}} onClick={deleteIotDevice}/></td>
            </tr>

            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update IoT Device</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="name.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter new device name"
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group
                        className="mb-3"
                        controlId="location.ControlInput2"
                    >
                        <Form.Label> Location <LocationOnIcon/> </Form.Label>
                        <Form.Control type="text" placeholder="(e.g. 37.417981,-121.972547)" autoFocus />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                Save Changes
                </Button>
            </Modal.Footer>
            </Modal>
        </>
    )
}

export default IOTDevice;