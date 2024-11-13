import React, { useState } from "react";
import { Navbar, Nav, Offcanvas, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';

const NavbarComponent = ({setIsLoggedIn }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate= useNavigate();

  const handleLogout = () => {
    // Clear the login state
    setIsLoggedIn(false); // Update the parent component's login state
    // localStorage.removeItem("isLoggedIn"); // Clear login data from localStorage
    navigate("/login"); // Redirect to the login page
  };

  return (
    <>
      {/* Top Navbar */}
      <Navbar
        style={{ height: "5rem" }}
        className="custom-navbar"
        bg="dark"
        variant="dark"
        sticky="top"
        expand="lg"
      >
        <Container
          fluid
          className="d-flex align-items-center justify-content-between"
        >
          {/* Navbar Brand */}
          <div className="d-flex align-items-center">
            <Navbar.Brand className="navbar-brand-custom">
              BLOCKCHAIN APP
            </Navbar.Brand>

            {/* Menu Button placed next to the brand */}
            <Button
              variant="outline-light"
              onClick={handleShow}
              // className="menu-button"
              style={{ marginLeft: "15px" }}
            >
              ☰ Menu
            </Button>
          </div>

          {/* Right side of the Navbar */}
          <Nav className="ml-auto">
            <Button variant="outline-light" onClick={handleLogout}>
              <LogoutIcon/> Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      {/* Sidebar Offcanvas */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        className="custom-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body
          style={{
            background:
              "linear-gradient(145deg, rgba(33, 37, 41, 1) 0%, rgba(56, 60, 66, 1) 100%)",
            color: "#fff",
            padding: "20px",
            // borderRadius: "8px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)",
          }}
        >
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/machine-pool" onClick={handleClose}>
              MACHINE POOL
            </Nav.Link>
            <Nav.Link as={Link} to="/blockchain-network" onClick={handleClose}>
              BLOCKCHAIN NETWORK
            </Nav.Link>
            {/* Add more navigation links as needed */}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default NavbarComponent;
