import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Modal,
  Box,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { signUpUser } from "../../services/authService";

const AuthModal = ({ open, onClose }) => {
  const { login } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState("");
  const [signInCredentials, setSignInCredentials] = useState({
    email: "",
    password: "",
  });
  const [signUpCredentials, setSignUpCredentials] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
    phone: "",
    profile_image: null,
    address: "",
    dob: "",
    gender: "",
    bio: "",
    organization: "",
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError("");
  };

  const handleSignInChange = (e) => {
    setSignInCredentials({ ...signInCredentials, [e.target.name]: e.target.value });
  };

  const handleSignUpChange = (e) => {
    if (e.target.name === "all") {
      // Reset all fields to initial state
      setSignUpCredentials({ ...e.target.value }); // Spread the initial object
    } else if (e.target.name === "profile_image") {
      setSignUpCredentials({ ...signUpCredentials, [e.target.name]: e.target.files[0] });
    } else {
      setSignUpCredentials({ ...signUpCredentials, [e.target.name]: e.target.value });
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const success = await login(signInCredentials);
      if (success) {
        onClose();
      } else {
        setError("Sign-in failed. Please check your credentials.");
      }
    } catch (err) {
      setError(err.message || "An error occurred during sign-in.");
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      for (const key in signUpCredentials) {
        if (signUpCredentials[key] !== null) {
          formData.append(key, signUpCredentials[key]);
        }
      }
      const response = await signUpUser(formData);
      console.log("Sign-up response:", response);
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred during sign-up.";
      setError(errorMessage);
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "white",
    boxShadow: 24,
    p: 2,
    borderRadius: 8,
    outline: "none",
  };

  const contentStyle = {
    maxHeight: "70vh",
    overflowY: "auto",
    padding: 2,
    borderRadius: 8,
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: 4,
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
  };

  const tabStyle = {
    textTransform: "none",
    color: "#1976d2",
    "&.Mui-selected": {
      color: "#1976d2",
      fontWeight: "bold",
    },
  };

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ backdropFilter: "blur(5px)" }}
    >
      <Box sx={modalStyle}>
        <Box sx={contentStyle}>
          <Typography variant="h6" component="h2" gutterBottom align="center">
            {tabValue === 0 ? "Sign In" : "Sign Up"}
          </Typography>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Sign In" sx={tabStyle} />
            <Tab label="Sign Up" sx={tabStyle} />
          </Tabs>
          {tabValue === 0 ? (
            <SignInForm
              credentials={signInCredentials}
              onChange={handleSignInChange}
              onSubmit={handleSignInSubmit}
              error={error}
              setError={setError}
            />
          ) : (
            <SignUpForm
              credentials={signUpCredentials}
              onChange={handleSignUpChange}
              onSubmit={handleSignUpSubmit}
              error={error}
              setError={setError}
            />
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthModal;