import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Modal, Box, Tabs, Tab, Typography } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { signUpUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ open, onClose }) => {
  const { login, user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();
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
    setSignInCredentials({
      ...signInCredentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUpChange = (e) => {
    if (e.target.name === "all") {
      setSignUpCredentials({ ...e.target.value });
    } else if (e.target.name === "profile_image") {
      setSignUpCredentials({
        ...signUpCredentials,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setSignUpCredentials({
        ...signUpCredentials,
        [e.target.name]: e.target.value,
      });
    }
  };

 const handleSignInSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const result = await login(signInCredentials);

    if (result.success) {
      toast.success("Signed in successfully!");
      if (result.user.role === "admin") navigate("/admin");
      else navigate("/");
    } else {
      const errorMessage = "Sign-in failed. Please check your credentials.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  } catch (err) {
    // ✅ Handle blocked user here
    console.log("Error:",err);
    
    if (err.status === 403) {
      toast.error("Your account has been blocked. Please contact support.", {
        position: "top-right",
        autoClose: 5000,
      });
    } else if (err.status === 404) {
      toast.error("User not found.");
    } else {
      toast.error(err.message || "An error occurred during sign-in.");
    }

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
      console.log("Showing success toast for sign-up");
      toast.success("Signed up successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        toastId: "sign-up-success",
      });
      setTimeout(onClose, 2000); // Delay closing to show toast
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during sign-up.";
      setError(errorMessage);
      console.log("Showing error toast for sign-up", errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        toastId: "sign-up-error",
      });
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
    zIndex: 1300,
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
    <Modal open={open} onClose={onClose} sx={{ backdropFilter: "blur(5px)" }}>
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
          {/* Test button to trigger a toast
          <button onClick={() => toast.success("Test Toast!", { toastId: "test-toast" })}>
            Test Toast
          </button> */}
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthModal;
