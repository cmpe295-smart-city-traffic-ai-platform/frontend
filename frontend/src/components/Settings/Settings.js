import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Form, Container, Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Settings = () => {
  const email = localStorage.getItem("email");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [warningText, setWarningText] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    //console.log(email, password); 
    /* Uncomment this section once deployed in cloud 
    axios
      .post("/api/v1/dashboard/user/update", {
        email: email,
        password: (password === "" ? null : password),
        firstName: (firstName === "" ? null : firstName),
        lastName: (lastName === "" ? null : lastName),
      })
      .then((response) => {
        console.log(response.data.message);

        //setUser(response.data);
        setWarningText(
            <Alert variant="success">
              Account has been updated!
            </Alert>
          );
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("password", response.data.password);
        localStorage.setItem("lastName", response.data.lastName);
        localStorage.setItem("firstName", response.data.firstName);
        localStorage.setItem("user_id", response.data.userId);
        window.location = "/";
      })
      .catch((error) => {
        console.log(error);
        setWarningText(
          <Alert variant="danger">
            Error!
          </Alert>
        );
      }); */
  }

  function handleLogin(event) {
    event.preventDefault();
    window.location = "/login";
  }

  return (
    <div>
      <Container className="py-6">
        <div
          className="mx-auto mb24 p24 wmx3 bg-white bar-lg bs-xl mb24"
          style={{ width: "60%" }}
        >
          <br />
          <div>
            <h1
              className="ta-center fs-title mx-auto"
              style={{ textAlign: "center" }}
            >
              Account Settings
            </h1>
          </div>
          <br />
          {warningText}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label className="d-flex justify-content-start">
                First Name
              </Form.Label>
              <Form.Control
                
                type="firstName"
                placeholder="Enter first name"
                name="firstName"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                autoFocus
              />
            </Form.Group>
            <br />
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label className="d-flex justify-content-start">
                Last Name
              </Form.Label>
              <Form.Control
                
                type="lastName"
                placeholder="Enter last name"
                name="lastName"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                autoFocus
              />
            </Form.Group>
            <br />
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="d-flex justify-content-start">
                Password
              </Form.Label>
              <Form.Control
                
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Form.Group>
            <br />            
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
          <br />
          
          
        </div>
      </Container>
    </div>
  );
};
export default Settings;