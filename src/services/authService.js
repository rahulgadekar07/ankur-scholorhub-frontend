//authService.js
import axios from "axios";

// Take base URL from environment variable
const baseUrl = process.env.REACT_APP_BASE_URL;

export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.post(`${baseUrl}auth/login`, {
      email,
      password,
    });
    return response.data; // Assumes response.data is { user, token }
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error("Login error:", error.response?.data || error.message);
    throw { status: error.response?.status, message };
  }
};

export const signUpUser = async (formData) => {
  try {
    const response = await axios.post(`${baseUrl}auth/signup`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Sign-up response:", response);
    return response.data; // Return only data, assuming { user, token }
  } catch (error) {
    console.error("Sign-up error:", error.response?.data || error.message);
    throw error.response?.data || { message: error.message }; // Throw error data or default message
  }
};