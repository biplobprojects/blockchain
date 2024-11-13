import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React from "react";
import { Button } from "react-bootstrap";

const AddNetworkModalContent = ({
  formError,
  setOpen,
  formData,
  handleChange,
  handleAddNetwork,
}) => {
  console.log(formError, "FORM ERROR::::::");
  return (
    <>
      <TextField
      sx={{mb:2}}
        error={!!formError.networkid}
        helperText={formError.networkid}
        label="Network ID"
        name="networkid"
        value={formData.networkid}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        fullWidth
        error={!!formError.name}
        helperText={formError.name}
        sx={{mb:2}}
      />

      <TextField
        label="Password"
        name="pwd"
        value={formData.pwd}
        onChange={handleChange}
        type="password"
        required
        fullWidth
        error={!!formError.pwd}
        helperText={formError.pwd}
      />
    </>
  );
};

export default AddNetworkModalContent;
