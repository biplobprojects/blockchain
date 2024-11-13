import React, { useEffect, useState, useCallback, lazy, Suspense } from "react";
import "./BlockChainNetworkComponent.css";
import NodeManagement from "./nodes/NodeManagement";
import CloseIcon from "@mui/icons-material/Close";
import ErrorMessageBox from "../errorMessageBox/ErrorMessageBox";
import {
  fetchBlockChainNetworks,
  deleteNetworks,
  addNetwork,
} from "../../api/blockchainNetworkApi";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const AddNetworkModalContent = lazy(() =>
  import("../../components/modals/AddNetworkModalContent")
);

const BlockChainNetworkTable = lazy(() =>
  import("../../view/table/BlockChainNetworkTable")
);

const styles = {
  container: {
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    backgroundColor: "#f0f4f8",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#333",
    fontFamily: "auto",
    textAlign: "center",
    margin: "0",
    padding: "0",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "transparent",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1300, // Ensure it overlays content
  },

  loadingOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Transparent black background
    zIndex: 1200, // Slightly lower than the spinner
  },

  loadingText: {
    marginTop: "20px",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "blueviolet", // Matching color to spinner
    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)", // Text shadow for a pop effect
  },

  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
};

const BlockChainNetworkComponent = () => {
  const [networkList, setNetworkList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // Modal open/close state
  const [formData, setFormData] = useState({
    networkid: "",
    name: "",
    pwd: "",
  });

  const [formError, setFormError] = useState({
    networkid: "",
    name: "",
    pwd: "",
  });

  //centralized error handling with automatic cleanup:
  const handleError = useCallback((message) => {
    setError(message);
    const timer = setTimeout(() => {
      setError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    let valid = true;
    let errors = { networkid: "", name: "", pwd: "" };

    if (!formData.networkid) {
      errors.networkid = "Networkid is required";
      valid = false;
    }

    if (!formData.name) {
      errors.name = "Name is required";
      valid = false;
    }

    if (!formData.pwd) {
      errors.pwd = "password is required";
      valid = false;
    }

    setFormError(errors);
    return valid;
  };
  // Memoized fetchNetworkData using useCallback
  const fetchNetworkData = useCallback(async () => {
    try {
      const parent = "parent";
      const NetworkList = await fetchBlockChainNetworks(parent);
      console.log(NetworkList, "ALL NETWORK LIST::::");
      setNetworkList(NetworkList);
    } catch (err) {
      handleError("Failed to fetch network list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNetworkData();
  }, [fetchNetworkData]); // useCallback ensures that fetchNetworkData is memoized

  const handleNetworkDelete = async (networkid) => {
    try {
      const parent = "your-parent-value";
      await deleteNetworks(parent, networkid);
      setNetworkList((prevNetworks) =>
        prevNetworks.filter((network) => network.networkid !== networkid)
      );
    } catch (err) {
      handleError("Failed to delete network");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Function to handle form submission to add network
  const handleAddNetwork = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const parent = "parent"; // Your parent value
      const addedNetwork = await addNetwork(parent, formData); // Assuming this returns the newly added network
      console.log(addedNetwork, "NEW ADDED NETWORK::");
      // Check if addedNetwork has valid data before updating the list
      if (addedNetwork) {
        setNetworkList((prevNetworks) => [...prevNetworks, addedNetwork]); // Add new network to the list
        setOpen(false); // Close modal after successful addition
      } else {
        handleError("Failed to add network");
      }
    } catch (err) {
      handleError("Failed to add network");
    }
  };
  if (loading) {
    return (
      <>
        <div style={styles.loadingOverlay}></div> {/* Transparent Black Background */}
        <div style={styles.loadingContainer}>
          <CircularProgress  color="primary" size={60} />
        </div>
      </>
    );
  }

  // Function to render the modal for adding a network
  // Render the modal component when needed
  const renderDialog = () => (
    <Suspense fallback={<CircularProgress />}>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{color:"blue", fontSize:'1.5rem'}}>
          Add New Network
        
        </DialogTitle>
        <DialogContent dividers>
          <AddNetworkModalContent
            formError={formError}
            formData={formData}
            handleChange={handleChange}
            handleAddNetwork={handleAddNetwork}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleAddNetwork} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
     </Suspense>
  );


  return (
    <>
      <Box style={styles.container}>
        <h1 style={styles.heading}>LIST OF ALL EXISTING NETWORKS</h1>
      </Box>

      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "10px",
        }}
      >
        <Tooltip
          title={<span style={{ fontSize: "1rem" }}>Add new Network</span>}
          arrow
          placement="top"
        >
          <Button
            sx={{
              backgroundColor: "blueviolet",
              color: "#fff",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              fontSize: "1.5rem",
              fontWeight: "bold",
              minWidth: "unset",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                backgroundColor: "#218838",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
              },
              "&:active": {
                backgroundColor: "#1e7e34",
                boxShadow: "none",
              },
            }}
            variant="contained"
            onClick={() => setOpen(true)}
          >
            <AddIcon fontSize="large" />
          </Button>
        </Tooltip>
      </div>
      {open && renderDialog()}

      <ErrorMessageBox error={error} onClose={() => setError(null)} />

      <Suspense fallback={<CircularProgress />}>
        <Box>
          <BlockChainNetworkTable
            networks={networkList}
            deleteNetworks={handleNetworkDelete}
            setError={handleError}
          />
        </Box>
      </Suspense>
    </>
  );
};

export default BlockChainNetworkComponent;
