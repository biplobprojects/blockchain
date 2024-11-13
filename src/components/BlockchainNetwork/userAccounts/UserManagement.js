import React, { useCallback, useEffect, useState } from "react";
import {
  getAllEthereumAccount,
  createRemoteAccount,
  createLocalAccount,
  deleteRemoteAccount,
} from "../../../api/blockchainNetworkApi";
import { useNavigate } from "react-router-dom";
import ErrorMessageBox from "../../errorMessageBox/ErrorMessageBox";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AllAccountsTable from "../../../view/table/AllAccountsTable";
import { useLocation } from "react-router-dom";

const styles = {
  container: {
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px 20px",
    backgroundColor: "#f0f4f8",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: "2rem",
    color: "#333",
    fontFamily: "auto",
    textAlign: "center",
    margin: "0",
    padding: "0",
  },
};

const UserManagement = () => {
  const location = useLocation();
  const { enr, networkid, username, name, host } = location.state || {};

  const [accounts, setAccounts] = useState();
  const [error, setError] = useState(null);
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    networkid: networkid || "",
    username: "",
    pwd: "",
  });
  const navigate = useNavigate();

  const fetchAllAccounts = useCallback(async () => {
    try {
      const parent = "parent";
      const AccountList = await getAllEthereumAccount(parent, networkid);
      setAccounts(AccountList);
    } catch (err) {
      setError("FAILED TO FETCH NODE LIST");
    }
  }, [networkid]);

  useEffect(() => {
    fetchAllAccounts();
  }, [fetchAllAccounts]);

  const handleBacktoNetworkPage = () => {
    navigate("/blockchain-network");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAccountCreation = (event) => {
    setSelectedAccountType(event.target.value);
    setOpenModal(true);
  };

  const handleDeleteAccount = async () => {
    const parent = "parent";
    const requestBody = {
      pemFile: enr,
      name: name,
      username: username,
      host: host,
      address: "",
      networkid: networkid,
    };

    try {
      await deleteRemoteAccount(parent, requestBody);
      fetchAllAccounts();
    } catch (error) {
      setError("Failed to delete account");
    }
  };

  const handleSubmit = async () => {
    const parent = "parent";
    try {
      let payload = { ...formData }; // Create a copy of formData
      if (selectedAccountType === "remote") {
        await createRemoteAccount(parent, payload);
      } else {
        // Remove the pwd field for local accounts
        const { pwd, ...localAccountPayload } = payload;
        await createLocalAccount(parent, localAccountPayload);
      }
      setOpenModal(false);
      fetchAllAccounts(); // Refresh account list
    } catch (error) {
      if(selectedAccountType === "remote"){

      setError("Failed to create remote account");
        
      } else {
        setError("Failed to create local account")
      }
    }
  };

  return (
    <>
      <Box>
        <Tooltip title="Go Back">
          <Button onClick={handleBacktoNetworkPage}>
            <ArrowBackIcon fontSize="medium"/> Back
          </Button>
        </Tooltip>
      </Box>

      <Box style={styles.container}>
        <h1 style={styles.heading}>
          LIST OF ALL ACCOUNTS FOR NetworkId (
          <b style={{ color: "blue" }}>{networkid}</b>)
        </h1>
      </Box>

      {/* Select dropdown for account creation */}
      <Box sx={{ margin: "20px auto", width: "300px" }}>
        <FormControl fullWidth>
          <InputLabel>Create Account</InputLabel>
          <Select
            value={selectedAccountType}
            onChange={handleAccountCreation}
            label="Create Account"
          >
            <MenuItem value="remote">Create Remote Account</MenuItem>
            <MenuItem value="local">Create Local Account</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Account creation modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>
          {selectedAccountType === "remote"
            ? "Create Remote Account"
            : "Create Local Account"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="NetworkId"
            name="networkid"
            value={formData.networkid}
            fullWidth
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            label="Username"
            name="username"
            fullWidth
            onChange={handleFormChange}
          />
          {selectedAccountType === "remote" && (
            <TextField
              margin="dense"
              label="Password"
              name="pwd"
              type="password"
              fullWidth
              onChange={handleFormChange}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <ErrorMessageBox error={error} onClose={()=> setError(null)}/>

      <AllAccountsTable
        Accounts={accounts}
        deleteRemoteAccount={handleDeleteAccount}
      />
    </>
  );
};

export default UserManagement;
