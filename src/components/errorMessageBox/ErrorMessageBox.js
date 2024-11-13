// ErrorMessageBox.js
import React from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ErrorMessageBox = ({ error, onClose }) => {
  if (!error) return null; // Don't render if there's no error

  return (
    <Box
      sx={{
        backgroundColor: "#fdecea",
        color: "#d32f2f",
        borderRadius: "8px",
        padding: "16px",
        margin: "20px auto",
        maxWidth: "600px",
        display: "flex",
        alignItems: "center",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            height: "24px",
            width: "24px",
            marginRight: "12px",
            color: "#d32f2f",
          }}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span style={{ fontSize: "16px", fontWeight: "500" }}>
          {error}
        </span>
      </Box>
      <IconButton aria-label="close" size="small" onClick={onClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default ErrorMessageBox;
