import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";

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

const AllAccountsTable = ({ Accounts, deleteRemoteAccount }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedAccount, setSelectedAccount] = React.useState(null);

  const handleClickOpen = (account) => {
    setSelectedAccount(account);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedAccount) {
      deleteRemoteAccount(selectedAccount);
    }
    setOpen(false);
  };

  const headers = [
    { label: "NetworkId", key: "networkid" },
    { label: "UserName", key: "username" },
    { label: "Address", key: "address" },
    { label: "Status", key: "status" },
    { label: "Account Type", key: "acctype" },
    { label: "Actions", key: "actions" },
  ];

  return (
    <>
      <div>
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
              {Accounts && Accounts.length > 0 ? (
                Accounts.map((account, index) => (
                  <StyledTableRow key={index}>
                    {headers.map((header, idx) => (
                      <StyledBodyTableCell key={idx}>
                        {header.key === "actions" ? (
                          account.acctype === "REMOTE" ? (
                            <Button
                              color="error"
                              aria-label="delete"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleClickOpen(account)}
                            >
                              Delete
                            </Button>
                          ) : null
                        ) : (
                          account[header.key]
                        )}
                      </StyledBodyTableCell>
                    ))}
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
      </div>

      {/* Confirmation Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle sx={{color:'red'}} id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the account with username 
            <strong style={{color:'blueviolet'}}>"{selectedAccount?.username}"</strong> 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllAccountsTable;
