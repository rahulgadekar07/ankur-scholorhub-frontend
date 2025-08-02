import React, { useState, useEffect } from "react";
import { TextField, Button, Alert, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";

const SignUpForm = ({ credentials, onChange, onSubmit, error, setError }) => {
  const [touched, setTouched] = useState({
    full_name: false,
    email: false,
    password: false,
    role: false,
    profile_image: false,
  });
  const [validationErrors, setValidationErrors] = useState({});

  const validateField = (name, value) => {
    const errors = {};
    if (name === "full_name" && !value && touched.full_name) errors.full_name = "Full Name is required.";
    if (name === "email" && !value && touched.email) errors.email = "Email is required.";
    else if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && touched.email)
      errors.email = "Invalid email format.";
    if (name === "password" && !value && touched.password) errors.password = "Password is required.";
    if (name === "role" && !value && touched.role) errors.role = "Role is required.";
    if (name === "profile_image" && !value && touched.profile_image)
      errors.profile_image = "Profile image is required.";
    return errors;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setValidationErrors((prev) => ({ ...prev, ...validateField(name, value) }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    onChange(e);
    if (name === "profile_image" && files && files[0]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.profile_image;
        return newErrors;
      });
    } else {
      setValidationErrors((prev) => ({ ...prev, ...validateField(name, value) }));
    }
  };

  useEffect(() => {
    const allErrors = {};
    for (const [name, value] of Object.entries(credentials)) {
      Object.assign(allErrors, validateField(name, value));
    }
    setValidationErrors(allErrors);
  }, [credentials, touched]);

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

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Full Name"
        name="full_name"
        value={credentials.full_name}
        onChange={handleChange}
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
        onChange={handleChange}
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
        onChange={handleChange}
        onBlur={handleBlur}
        margin="normal"
        variant="outlined"
        required
        error={!!validationErrors.password}
        helperText={validationErrors.password || ""}
        FormHelperTextProps={{ style: { color: "red" } }}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Role"
        name="role"
        value={credentials.role}
        onChange={handleChange}
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
        onChange={handleChange}
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
        onChange={handleChange}
        onBlur={handleBlur}
        style={{ display: "none" }} // Hide the default input
      />
      {validationErrors.profile_image && (
        <Typography color="error" sx={{ mb: 2 }}>
          {validationErrors.profile_image}
        </Typography>
      )}
      <TextField
        fullWidth
        label="Address"
        name="address"
        value={credentials.address}
        onChange={handleChange}
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
        onChange={handleChange}
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
          onChange={handleChange}
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
        onChange={handleChange}
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
        onChange={handleChange}
        margin="normal"
        variant="outlined"
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
        Sign Up
      </Button>
    </form>
  );
};

export default SignUpForm;