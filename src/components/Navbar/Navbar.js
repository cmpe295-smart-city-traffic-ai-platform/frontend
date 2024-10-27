import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

class NavigationBar extends Component {
    render() {
    return (
        <Navbar data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
        <Container>
            <Navbar.Brand>Smart City </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/home">Home</Nav.Link>
                <Nav.Link href="/alerts">Alerts</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link href="/settings">Settings</Nav.Link>
                <Nav.Link eventKey={2} href="/registration">
                    Log in
                </Nav.Link>
          </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        );
    }
}

export default NavigationBar;