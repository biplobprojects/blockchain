import {
  Box,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  getNodesOfNetwork,
  deleteNode,
  addNodes,
} from "../../../api/blockchainNetworkApi";
import NodeListTable from "../../../view/table/NodeListTable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import ErrorMessageBox from "../../errorMessageBox/ErrorMessageBox";
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

const NodeManagement = () => {
  const location = useLocation();
  const { username, name, pemfile, enr, networkid, host } =
    location.state || {};

  console.log(
    username,
    name,
    pemfile,
    enr,
    "props received from BlockChainTable:::"
  ); // You can use these values in your component logic

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [nodeList, setNodeList] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    host: "",
    pemFile: null,
    username: "",
    networkid: networkid,
    name: name,
    enr: enr,
  });

  const handleBack = () => {
    navigate("/blockchain-network");
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchAllNodes = useCallback(async () => {
    try {
      const parent = "parent";
      const NodeList = await getNodesOfNetwork(parent, networkid);
      console.log(NodeList, "ALL NODES::::");
      setNodeList(NodeList);
      // Automatically set ENR from the first node in the list if available
      if (NodeList.length > 0) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          enr: NodeList[0].enr || "", // Autofill with the first node's ENR or leave blank
        }));
      }
    } catch (err) {
      setError("FAILED TO FETCH NODE LIST");
    }
  }, [networkid]);

  useEffect(() => {
    fetchAllNodes();
  }, [fetchAllNodes]);

  const handleNodeDelete = useCallback(
    async (networkid, ipaddress) => {
      try {
        const parent = "your-parent-value";
        await deleteNode(parent, networkid, ipaddress);
        setNodeList((prevNodes) =>
          prevNodes.filter(
            (node) =>
              node.networkid !== networkid || node.ipaddress !== ipaddress
          )
        );
      } catch (err) {
        setError("Failed to delete node");
      }
    },
    [networkid]
  );

  const handleFileChange = (e) => {
    setFormData({ ...formData, pemFile: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parent = "your-parent-value";
      const form = new FormData();
      form.append("host", formData.host);
      form.append("pemFile", formData.pemFile);
      form.append("username", formData.username);
      form.append("networkid", formData.networkid);
      form.append("name", formData.name);
      form.append("enr", formData.enr);

      await addNodes(parent, form);
      fetchAllNodes(); // Refresh node list after adding a node
      setOpen(false); // Close dialog after successful submission
    } catch (err) {
      setError("Failed to add new node");
    }
  };

  return (
    <>
      <Box>
        <Tooltip title="Go Back">
          <Button onClick={handleBack}>
            <ArrowBackIcon fontSize="medium" /> Back
          </Button>
        </Tooltip>
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
          title={<span style={{ fontSize: "15px" }}>Add new Node</span>}
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
            onClick={() => setOpen(true)} // Open dialog on click
          >
            <AddIcon fontSize="large" />
          </Button>
        </Tooltip>
      </div>

      {/* Dialog for Adding a New Node */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: "blue", fontSize: "1.5rem" }}>
          Add New Node
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <TextField
              label="Host"
              name="host"
              value={formData.host}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />

            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />

            <TextField
              label="Networkid"
              name="networkid"
              value={formData.networkid}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />

            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Enr"
              name="enr"
              value={formData.enr}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />

            <input
              type="file"
              name="pemFile"
              accept=".pem"
              onChange={handleFileChange}
              required
              style={{ marginTop: "16px", marginBottom: "16px" }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Add Node
          </Button>
        </DialogActions>
      </Dialog>

      <Box style={styles.container}>
        <h1 style={styles.heading}>
          LIST OF ALL NODES FOR NETWORK-ID(
          <b style={{ color: "blue" }}>{networkid}</b>)
        </h1>
      </Box>

      <ErrorMessageBox error={error} onClose={() => setError(null)} />
      <NodeListTable Nodes={nodeList} deleteNode={handleNodeDelete} />
    </>
  );
};

export default NodeManagement;
