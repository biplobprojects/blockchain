import React, { useEffect, useState } from "react";
import {
  fetchMachineData,
  addMachine,
  deleteMachine,
  getFreeMachine,
} from "../../api/machinePoolApi";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import MachineTable from "../../view/table/MachineTable";
import AddIcon from "@mui/icons-material/Add";
import ErrorMessageBox from "../errorMessageBox/ErrorMessageBox";

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

const MachineComp = () => {
  const [machines, setMachines] = useState([]);
  const [freemachines, setFreeMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false); // State to manage modal visibility
  const [newMachine, setNewMachine] = useState({
    pemfile: null,
    host: "",
    username: "",
  });
  const [formError, setFormError] = useState({
    host: "",
    username: "",
    pemfile: "",
  });

    useEffect(()=>{
  if(error){
    const timer= setTimeout(() => {
      setError(null);
    }, 5000);

    return ()=> clearTimeout(timer);
  }
    },[error]);

  useEffect(() => {
    const getFreeMachines = async () => {
      try {
        const parent = "your-parent-value"; // Replace with actual parent value

        const response = await getFreeMachine(parent);
        setFreeMachines(response);
      } catch (err) {
        setError("Failed to fetch free machine");
      } finally {
        setLoading(false);
      }
    };
    getFreeMachines();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parent = "your-parent-value"; // Replace with actual parent value
        const machineData = await fetchMachineData(parent);
        setMachines(machineData);
      } catch (err) {
        setError("Failed to fetch machine data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (host) => {
    try {
      const parent = "your-parent-value";
      await deleteMachine(parent, host);
      setMachines((prevMachines) =>
        prevMachines.filter((machine) => machine.host !== host)
      );
    } catch (err) {
      setError("Failed to delete machine");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormError({ host: "", username: "", pemfile: "" });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewMachine((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewMachine((prev) => ({ ...prev, pemfile: file }));
  };

  const validateForm = () => {
    let valid = true;
    let errors = { host: "", username: "", pemfile: "" };

    if (!newMachine.host) {
      errors.host = "Host is required";
      valid = false;
    }

    if (!newMachine.username) {
      errors.username = "Username is required";
      valid = false;
    }

    if (!newMachine.pemfile) {
      errors.pemfile = "PEM file is required";
      valid = false;
    }

    setFormError(errors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("pemFile", newMachine.pemfile); // Add file to formData
      formData.append("host", newMachine.host);
      formData.append("username", newMachine.username);

      const parent = "your-parent-value"; // Replace with actual parent value

      // Call the API to add the new machine
      await addMachine(parent, formData); // Pass both parent and formData

      // After successful submission, fetch updated data
      const machineData = await fetchMachineData(parent);
      setMachines(machineData);

      handleClose(); // Close the modal
      setNewMachine({ pemfile: null, host: "", username: "" });
    } catch (error) {
      setError("Failed to add machine");
    }
  };

  if (loading) {
    return (
      <>
        <div style={styles.loadingOverlay}></div> {/* Transparent Black Background */}
        <div style={styles.loadingContainer}>
          <CircularProgress color="primary" size={60} />
        </div>
      </>
    );
  }

  return (
    <>
      <div style={styles.container}>
        <h1 style={styles.heading}>LIST OF ALL MACHINES</h1>
      </div>

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
          title={<span style={{ fontSize: "15px" }}>Add new machine</span>}
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
            onClick={handleClickOpen}
          >
            <AddIcon fontSize="large" />
          </Button>
        </Tooltip>
      </div>

      <ErrorMessageBox error={error} onClose={() => setError(null)} />

      <div>
        <MachineTable machines={machines} onDelete={handleDelete} />
      </div>

      {/* Modal for Adding New Machine */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: "blue" }}>Add New Machine</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            name="host"
            label="Host"
            type="text"
            fullWidth
            variant="outlined"
            value={newMachine.host}
            onChange={handleInputChange}
            error={!!formError.host}
            helperText={formError.host}
          />

          <TextField
            margin="dense"
            required
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={newMachine.username}
            onChange={handleInputChange}
            error={!!formError.username}
            helperText={formError.username}
          />
          <input
            type="file"
            required
            accept=".pem"
            onChange={handleFileChange}
            style={{ marginTop: "16px", marginBottom: "16px" }}
          />
          {formError.pemfile && (
            <p style={{ color: "red", marginTop: "-12px" }}>
              {formError.pemfile}
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MachineComp;
