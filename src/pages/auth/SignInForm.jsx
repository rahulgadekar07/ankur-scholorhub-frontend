import React, { useState } from "react";
import { TextField, Button, Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const SignInForm = ({ credentials, onChange, onSubmit, error }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

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
        type={showPassword ? "text" : "password"}
        value={credentials.password}
        onChange={onChange}
        margin="normal"
        variant="outlined"
        required
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
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