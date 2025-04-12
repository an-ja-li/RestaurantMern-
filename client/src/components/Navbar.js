import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from '../components/button'; // Custom Button component
import "./Navbar.css";

const CustomNavbar = () => {
  return (
    <Navbar expand="lg" className="custom-navbar py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          Food O'clock
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="nav-links">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/staff">Staff</Nav.Link>
            <Nav.Link as={Link} to="/Food">Food & Drink</Nav.Link>
            {/* <Nav.Link as={Link} to="/order">Order</Nav.Link>
            <Nav.Link as={Link} to="/bills">Bills</Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
        <Button>Login</Button>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
