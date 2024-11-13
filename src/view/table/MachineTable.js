import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";

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

const MachineTable = ({ machines, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [machineToDel, setMachineToDel] = useState(null);
  const [usernameToDel, setShowUsername] = useState(null);


  const handleDelete = (machine) => {
    setMachineToDel(machine.host);
    setShowUsername(machine.username)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMachineToDel(null);
    setShowUsername(null);
  };

  const handleConfirmDelete = () => {
    if (machineToDel) {
      onDelete(machineToDel);
      handleClose();
    }
  };

  return (
    <div>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Host</StyledTableCell>
              <StyledTableCell>Username</StyledTableCell>
              <StyledTableCell>Pem File</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {machines.map((machine, index) => (
              <StyledTableRow key={index}>
                <StyledBodyTableCell>{machine.host}</StyledBodyTableCell>
                <StyledBodyTableCell>{machine.username}</StyledBodyTableCell>
                <StyledBodyTableCell>{machine.pemfile}</StyledBodyTableCell>
                <StyledBodyTableCell>{machine.status}</StyledBodyTableCell>
                <StyledBodyTableCell>
                  <Button
                    variant="text"
            
                    onClick={() => handleDelete(machine)}
                    disabled={machine.status !== "FREE"}
                    startIcon={<DeleteIcon />}
                    color="error"
                  >
                    Delete
                  </Button>
                </StyledBodyTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{color:'red'}}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this machine?
          </DialogContentText>
          {usernameToDel && ( // Render username if available
            <DialogContentText>
              <strong style={{color:'violet'}}>{usernameToDel}</strong>
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MachineTable;
