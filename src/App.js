import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavbarComponent from "./components/Navbar/NavbarComponent";
import MachineComp from "./components/MachineComponent/MachineComp";
import BlockChainNetworkComponent from "./components/BlockchainNetwork/BlockChainNetworkComponent";
import NodeManagement from "./components/BlockchainNetwork/nodes/NodeManagement";
import UserManagement from "./components/BlockchainNetwork/userAccounts/UserManagement";
import LoginPage from "./components/loginPage/LoginPage"; // Import LoginPage

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state
  const [loading, setLoading] = useState(true); // Add loading state

  // Check localStorage for login state on component mount
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
    setLoading(false); // Done checking login status
  }, []);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
    localStorage.setItem("isLoggedIn", status); // Save login state to localStorage
  };

  if (loading) {
    return <div>Loading...</div>; // Render loading state while checking login status
  }

  return (
    <Router>
      <div>
        {isLoggedIn && <NavbarComponent setIsLoggedIn={handleLogin} />} {/* Show Navbar only if logged in */}
        <div className="main-content">
          <Routes>
            <Route
              path="/login"
              element={<LoginPage setIsLoggedIn={handleLogin} />} // Pass login handler to LoginPage
            />
            <Route
              path="/machine-pool"
              element={isLoggedIn ? <MachineComp /> : <Navigate to="/login" />} // Protect route
            />
            <Route
              path="/blockchain-network"
              element={isLoggedIn ? <BlockChainNetworkComponent /> : <Navigate to="/login" />}
            />
            <Route
              path="/nodes/:networkid"
              element={isLoggedIn ? <NodeManagement /> : <Navigate to="/login" />}
            />
            <Route
              path="/userAccount/:networkid"
              element={isLoggedIn ? <UserManagement /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to={isLoggedIn ? "/machine-pool" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
