import { React, useState } from "react";
import Table from 'react-bootstrap/Table';
import Container from "react-bootstrap/esm/Container";
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import AddIcon from '@mui/icons-material/Add';
import IOTDevice from "./IOTDevice/IOTDevice";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Col from "react-bootstrap/esm/Col";

const IOT = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <Container fluid="lg">
            <Row className="mt-3 mb-3">
                <Col align="left">
                    <h2> IOT Station Management </h2>
                </Col>
            </Row>
            
            <Row className="mt-3 mb-3">
                <Col align="left">
                    <Button variant="success" onClick={handleShow}><AddIcon/>Create IOT Device</Button>
                </Col>
            </Row>

            <Row className="mt-3 mb-3">
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Device ID</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th>Active</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <IOTDevice 
                                deviceId="Test ID" 
                                name="Test Name" 
                                location="Test Location" 
                                createdAt="test created at" 
                                updatedAt="test"
                                active={true}
                            />
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create IOT Device</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="name.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Device name"
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group
                        className="mb-3"
                        controlId="location.ControlInput2"
                    >
                        <Form.Label>Location </Form.Label> <LocationOnIcon/> 
                        <Form.Control type="text" placeholder="(e.g. 37.417981,-121.972547)" autoFocus />
                    </Form.Group>
                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            label="Active"
                            defaultChecked
                        />
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
        </Container>
    )
}

export default IOT;