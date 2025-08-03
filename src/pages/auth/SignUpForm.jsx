import React, { useState, useEffect, useCallback } from "react";
import { TextField, Button, Alert, FormControl, InputLabel, Select, MenuItem, Typography, Box } from "@mui/material";

const SignUpForm = ({ credentials, onChange, onSubmit, error, setError }) => {
  const [touched, setTouched] = useState({
    full_name: false,
    email: false,
    password: false,
    role: false,
    profile_image: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  const validateField = useCallback((name, value) => {
    const errors = {};
    if (name === "full_name" && !value && touched[name]) errors[name] = "Full Name is required.";
    if (name === "email" && !value && touched[name]) errors[name] = "Email is required.";
    else if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && touched[name])
      errors[name] = "Invalid email format.";
    if (name === "password" && !value && touched[name]) errors[name] = "Password is required.";
    if (name === "role" && !value && touched[name]) errors[name] = "Role is required.";
    if (name === "profile_image" && !value && touched[name]) errors[name] = "Profile image is required.";
    return errors;
  }, [touched]);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setValidationErrors((prev) => ({ ...prev, ...validateField(name, value) }));
  };

  const debouncedHandleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    onChange(e);
    if (name === "profile_image" && files && files[0]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.profile_image;
        return newErrors;
      });
      const file = files[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setValidationErrors((prev) => ({ ...prev, ...validateField(name, value) }));
    }
  }, [onChange, validateField]);

  useEffect(() => {
    const allErrors = {};
    for (const [name, value] of Object.entries(credentials)) {
      Object.assign(allErrors, validateField(name, value));
    }
    setValidationErrors(allErrors);
  }, [credentials, validateField]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const allErrors = {};
    for (const [name, value] of Object.entries(credentials)) {
      Object.assign(allErrors, validateField(name, value));
    }
    if (Object.keys(allErrors).length > 0) {
      setError("Please fix the validation errors before submitting.");
      return;
    }
    onSubmit(e);
  };

  const handleClear = () => {
    const initialCredentials = {
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
    };
    onChange({ target: { name: "all", value: initialCredentials } });
    setPreviewUrl(null);
    setTouched({
      full_name: false,
      email: false,
      password: false,
      role: false,
      profile_image: false,
    });
    setValidationErrors({});
    setError("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Full Name"
        name="full_name"
        value={credentials.full_name}
        onChange={debouncedHandleChange}
        onBlur={handleBlur}
        margin="normal"
        variant="outlined"
        required
        error={!!validationErrors.full_name}
        helperText={validationErrors.full_name || ""}
        FormHelperTextProps={{ style: { color: "red" } }}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={credentials.email}
        onChange={debouncedHandleChange}
        onBlur={handleBlur}
        margin="normal"
        variant="outlined"
        required
        error={!!validationErrors.email}
        helperText={validationErrors.email || ""}
        FormHelperTextProps={{ style: { color: "red" } }}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={credentials.password}
        onChange={debouncedHandleChange}
        onBlur={handleBlur}
        margin="normal"
        variant="outlined"
        required
        error={!!validationErrors.password}
        helperText={validationErrors.password || ""}
        FormHelperTextProps={{ style: { color: "red" } }}
        inputProps={{ autoComplete: "current-password" }}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Role"
        name="role"
        value={credentials.role}
        onChange={debouncedHandleChange}
        onBlur={handleBlur}
        margin="normal"
        variant="outlined"
        select
        SelectProps={{ native: true }}
        required
        error={!!validationErrors.role}
        helperText={validationErrors.role || ""}
        FormHelperTextProps={{ style: { color: "red" } }}
        sx={{ mb: 2 }}
      >
        <option value="student">Student</option>
        <option value="admin">Admin</option>
        <option value="donor">Donor</option>
        <option value="invigilator">Invigilator</option>
      </TextField>
      <TextField
        fullWidth
        label="Phone"
        name="phone"
        value={credentials.phone}
        onChange={debouncedHandleChange}
        margin="normal"
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <label htmlFor="profile-image-upload">
        <Button variant="contained" component="span" sx={{ mb: 2 }}>
          Upload Profile
        </Button>
      </label>
      <input
        id="profile-image-upload"
        type="file"
        name="profile_image"
        accept="image/*"
        onChange={debouncedHandleChange}
        onBlur={handleBlur}
        style={{ display: "none" }}
      />
      {validationErrors.profile_image && (
        <Typography color="error" sx={{ mb: 2 }}>
          {validationErrors.profile_image}
        </Typography>
      )}
      {previewUrl && (
        <div>
          <Typography sx={{ mb: 1 }}>Preview:</Typography>
          <img src={previewUrl} alt="Profile Preview" style={{ maxWidth: "100%", maxHeight: "200px", marginBottom: "16px" }} />
        </div>
      )}
      <TextField
        fullWidth
        label="Address"
        name="address"
        value={credentials.address}
        onChange={debouncedHandleChange}
        margin="normal"
        variant="outlined"
        multiline
        rows={2}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Date of Birth"
        name="dob"
        value={credentials.dob}
        onChange={debouncedHandleChange}
        margin="normal"
        variant="outlined"
        type="date"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel id="gender-label">Gender</InputLabel>
        <Select
          labelId="gender-label"
          name="gender"
          value={credentials.gender}
          onChange={debouncedHandleChange}
          label="Gender"
        >
          <MenuItem value="">
            <em>Select Gender</em>
          </MenuItem>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Bio"
        name="bio"
        value={credentials.bio}
        onChange={debouncedHandleChange}
        margin="normal"
        variant="outlined"
        multiline
        rows={2}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Organization"
        name="organization"
        value={credentials.organization}
        onChange={debouncedHandleChange}
        margin="normal"
        variant="outlined"
        sx={{ mb: 2 }}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error.message || error}</Alert>}
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ py: 1.5, fontSize: "16px" }}
        >
          Sign Up
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={handleClear}
          sx={{ py: 1.5, fontSize: "16px" }}
        >
          Clear
        </Button>
      </Box>
    </form>
  );
};

export default SignUpForm;