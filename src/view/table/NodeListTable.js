import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

import { deleteNode } from "../../api/blockchainNetworkApi";

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

const NodeListTable = ({ Nodes, deleteNode }) => {
  const [open, setOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);

  const nodeListTableHeader = [
    { label: "NetworkId", key: "networkid" },
    { label: "Ip Address", key: "ipaddress" },
    { label: "Username", key: "username" },
    { label: "Pemfile", key: "pemfile" },
    { label: "Actions", key: "actions" },
  ];

  const handleDeleteClick = (networkId, ipAddress, username) => {
    setNodeToDelete({ networkId, ipAddress, username });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNodeToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (nodeToDelete) {
      deleteNode(nodeToDelete.networkId, nodeToDelete.ipAddress);
      handleClose();
    }
  };
  return (
    <>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {nodeListTableHeader.map((header, index) => (
                <StyledTableCell key={index}>{header.label}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Nodes && Nodes.length > 0 ? (
              Nodes.map((nodes, index) => (
                <StyledTableRow key={index}>
                  <StyledBodyTableCell>{nodes.networkid}</StyledBodyTableCell>
                  <StyledBodyTableCell>{nodes.ipaddress}</StyledBodyTableCell>
                  <StyledBodyTableCell>{nodes.username}</StyledBodyTableCell>

                  <StyledBodyTableCell>{nodes.pemfile}</StyledBodyTableCell>

                  <StyledBodyTableCell>
                    <Button
                      variant="text"
                      onClick={() =>
                        handleDeleteClick(
                          nodes.networkid,
                          nodes.ipaddress,
                          nodes.username
                        )
                      }
                      startIcon={<DeleteIcon />}
                      color="error"
                    >
                      Delete
                    </Button>
                  </StyledBodyTableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="h6" color="textSecondary">
                    No data found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{color:'red'}}>Confirm Delete</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Are you sure you want to delete this node?
          </DialogContentText>
          {nodeToDelete && (
            <DialogContentText>
            <strong style={{color:'blueviolet'}}>{nodeToDelete.username}</strong>
            </DialogContentText>
          )}
        
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}  color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete}  color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NodeListTable;
