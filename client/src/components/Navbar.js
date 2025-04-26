import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import LoginModal from "../pages/LoginRegister"; // adjust path if needed
import "./Navbar.css";

const CustomNavbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
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
              <Nav.Link as={Link} to="/Order">Order</Nav.Link>
              <Nav.Link as={Link} to="/Billing">Bills</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <button className="blob-btn" onClick={() => setShowLoginModal(true)}>
            <span className="blob-btn__inner">
              <span className="blob-btn__blobs">
                <span className="blob-btn__blob"></span>
                <span className="blob-btn__blob"></span>
                <span className="blob-btn__blob"></span>
                <span className="blob-btn__blob"></span>
              </span>
            </span>
            Login
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'none' }}>
              <defs>
                <filter id="goo">
                  <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
                  <feColorMatrix in="blur" result="goo" type="matrix"
                    values="1 0 0 0 0  
                            0 1 0 0 0  
                            0 0 1 0 0  
                            0 0 0 20 -10">
                  </feColorMatrix>
                  <feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite>
                </filter>
              </defs>
            </svg>
          </button>
        </Container>
      </Navbar>

      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default CustomNavbar;
