import React from "react";
import { TextField, Button, Alert } from "@mui/material";

const SignInForm = ({ credentials, onChange, onSubmit, error }) => {
  return (
    <form onSubmit={onSubmit}>
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={credentials.email}
        onChange={onChange}
        margin="normal"
        variant="outlined"
        required
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={credentials.password}
        onChange={onChange}
        margin="normal"
        variant="outlined"
        required
        sx={{ mb: 2 }}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2, py: 1.5, fontSize: "16px" }}
      >
        Sign In
      </Button>
    </form>
  );
};

export default SignInForm;