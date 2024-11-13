import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Snackbar,
  Typography,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import ListIcon from "@mui/icons-material/List";
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete"; // Ensure DeleteIcon is also imported if not already
import {
  deleteNetworks,
  fetchNetworkDetails,
} from "../../api/blockchainNetworkApi"; // Import fetchNetworkDetails
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import CloseIcon from "@mui/icons-material/Close";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import ComputerIcon from "@mui/icons-material/Computer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import DescriptionIcon from "@mui/icons-material/Description";
import HomeWorkIcon from "@mui/icons-material/HomeWork";

// import { styled } from "@mui/material/styles";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  margin: "20px auto",
  borderRadius: "12px",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
  maxWidth: "90%",
  backgroundColor: "#f9fafb",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "16px",
  fontSize: "1.1rem",
  textAlign: "center",
}));

const StyledBodyTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "1rem",
  color: "#333",
  padding: "14px",
  textAlign: "center",
  borderBottom: "1px solid #e0e0e0",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f0f4f8",
  },
  "&:hover": {
    backgroundColor: "#e8f0fe",
    cursor: "pointer",
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 16,
    padding: theme.spacing(2),
    backgroundColor: "#fff",
    boxShadow: "0px 6px 20px rgba(0,0,0,0.12)",
  },
  "& .MuiDialogTitle-root": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(2, 3),
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(3),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(2, 3),
    justifyContent: "center",
  },
}));

const InfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: "#f5f7fa",
  borderRadius: 12,
  boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
}));

const InfoText = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  fontSize: "1.1rem",
  color: "#333",
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: "#fff",
}));
const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  backgroundColor: theme.palette.secondary.main,
  color: "#fff",
  borderRadius: 8,
  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const BlockChainNetworkTable = memo(({ networks, setError }) => {
  const navigate = useNavigate();
  const [networkList, setNetworkList] = useState(networks || []);
  const [open, setOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNetworkAction, setSelectedNetworkAction] = useState(null);
  const [networkDetails, setNetworkDetails] = useState(null); // New state for network details
  const [detailsModalOpen, setDetailsModalOpen] = useState(false); // State to manage details modal
  // New state for managing Snackbar visibility and message
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Effect to set initial network data
  useEffect(() => {
    setNetworkList(networks);
  }, [networks]);

  // Define headers and keys corresponding to each network field
  const headers = [
    { label: "NetworkId", key: "networkid" },
    { label: "Name", key: "name" },
    { label: "Ip Address", key: "ipaddress" },
    { label: "Username", key: "username" },
    { label: "Actions", key: "actions" },
  ];

  // Open modal to confirm deletion
  const handleDeleteClick = (network) => {
    setSelectedNetwork(network); // Set the network to be deleted
    setOpen(true); // Open modal
  };

  // Handle modal close
  const handleClose = () => {
    setOpen(false); // Close modal without deleting
    setSelectedNetwork(null);
  };

  //  Handle delete confirmation and show success Snackbar
  const handleDeleteConfirm = async () => {
    if (selectedNetwork) {
      const { networkid, name } = selectedNetwork;
      const reqBody = { networkid, name };
      const parent = "parent";
      try {
        await deleteNetworks(parent, reqBody);

        setNetworkList((prevList) =>
          prevList.filter((network) => network.networkid !== networkid)
        );

        // Show success message
        setSnackbarMessage(`Network "${name}" deleted successfully.`);
        setSnackbarOpen(true); // Open Snackbar
      } catch (error) {
        console.error("Error deleting network:", error);
        setError("Failed to delete network");
      } finally {
        handleClose();
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleNodes = (network) => {
    navigate(`/nodes/${network.networkid}`, {
      state: {
        username: network.username,
        name: network.name,
        pemfile: network.pemfile,
        networkid: network.networkid,
        enr: network.bootnode,
        host: network.ipaddress,
      },
    });
  };

  const handleUsers = (network) => {
    navigate(`/userAccount/${network.networkid}`, {
      state: {
        enr: network.bootnode,
        networkid: network.networkid,
        name: network.name,
        host: network.ipaddress,
        username: network.username,
      },
    });
  };

  // Handle dropdown menu
  const handleClickMenu = (event, network) => {
    setAnchorEl(event.currentTarget);
    setSelectedNetworkAction(network);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedNetworkAction(null);
  };

  const handleMenuAction = async (action) => {
    if (action === "details") {
      try {
        const details = await fetchNetworkDetails(
          "parent",
          selectedNetworkAction.networkid
        );
        setNetworkDetails(details); // Store details in state
        setDetailsModalOpen(true); // Open modal to display details
      } catch (error) {
        console.error("Error fetching network details:", error);
      }
    } else if (action === "delete") {
      handleDeleteClick(selectedNetworkAction);
    } else if (action === "users") {
      handleUsers(selectedNetworkAction);
    } else if (action === "nodes") {
      handleNodes(selectedNetworkAction); // Add logic for managing nodes
    }
    handleCloseMenu();
  };

  return (
    <div>
      {/* snackbar for successful deleted network */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <StyledTableCell key={index}>{header.label}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {networkList && networkList.length > 0 ? (
              networkList.map((network, index) => (
                <StyledTableRow key={index}>
                  {headers.map((header, idx) => (
                    <StyledBodyTableCell key={idx}>
                      {header.key === "actions" ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            onClick={(event) => handleClickMenu(event, network)}
                          >
                            <MoreVertIcon />
                          </Button>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                          >
                            <MenuItem
                              onClick={() => handleMenuAction("details")}
                            >
                              <ListItemIcon>
                                <ListIcon fontSize="small" color="secondary" />
                              </ListItemIcon>
                              <ListItemText>Details</ListItemText>
                            </MenuItem>

                            <MenuItem
                              onClick={() => handleMenuAction("delete")}
                            >
                              <ListItemIcon>
                                <DeleteIcon fontSize="small" color="error" />
                              </ListItemIcon>
                              <ListItemText>Delete</ListItemText>
                            </MenuItem>

                            <MenuItem onClick={() => handleMenuAction("nodes")}>
                              <ListItemIcon>
                                <SettingsInputComponentIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </ListItemIcon>
                              <ListItemText>Manage Nodes</ListItemText>
                            </MenuItem>

                            <MenuItem onClick={() => handleMenuAction("users")}>
                              <ListItemIcon>
                                <PeopleIcon fontSize="small" color="primary" />
                              </ListItemIcon>
                              <ListItemText>Manage Users</ListItemText>
                            </MenuItem>
                          </Menu>
                        </Box>
                      ) : (
                        network[header.key]
                      )}
                    </StyledBodyTableCell>
                  ))}
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="h6" color="textSecondary">
                    No data found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Confirmation Modal for delete */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{color:'red'}}>Confirm Delete</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Are you sure you want to delete the network:{" "}
            <strong style={{color:'blueviolet'}}>{selectedNetwork?.networkid}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Network Details Modal */}
      <StyledDialog
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        TransitionProps={{ onEnter: () => console.log("Dialog opened!") }} // Optional smooth opening effect
      >
        <DialogTitle>
          Network Details
          <CloseButton onClick={() => setDetailsModalOpen(false)}>
            <CloseIcon />
          </CloseButton>
        </DialogTitle>
        <DialogContent>
          {networkDetails ? (
            <>
              {/* Network ID */}
              <InfoBox>
                <NetworkCheckIcon color="primary" fontSize="large" />
                <InfoText>
                  <strong>Network ID:</strong> {networkDetails.networkid}
                </InfoText>
              </InfoBox>

              {/* host */}
              {/* <InfoBox>
              <HomeWorkIcon color="primary" fontSize="large" />
              <InfoText>
                <strong>Host:</strong> {networkDetails.host}
              </InfoText>
            </InfoBox> */}

              {/* Name */}
              <InfoBox>
                <ComputerIcon color="secondary" fontSize="large" />
                <InfoText>
                  <strong>Name:</strong> {networkDetails.name}
                </InfoText>
              </InfoBox>

              {/* Password */}
              <InfoBox>
                <VpnKeyIcon color="error" fontSize="large" />
                <InfoText>
                  <strong>Password:</strong> {networkDetails.pwd}
                </InfoText>
              </InfoBox>

              {/* PEM file */}
              {/* <InfoBox>
              <DescriptionIcon  color="error" fontSize="large" />
              <InfoText>
                <strong>PEM:</strong> {networkDetails.pemFile}
              </InfoText>
            </InfoBox> */}

              {/* Add more details as needed */}
            </>
          ) : (
            <DialogContentText>Loading...</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => setDetailsModalOpen(false)}>
            Close
          </StyledButton>
        </DialogActions>
      </StyledDialog>
      
    </div>
  );
});

export default BlockChainNetworkTable;
