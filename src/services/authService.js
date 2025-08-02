import axios from "axios";

const BASE_URL = "https://ankur-scholorhub-backend-aehg.onrender.com/api/";

export const loginUser = async ({ email, password }) => {
  const response = await axios.post(`${BASE_URL}auth/login`, {
    email,
    password,
  });
  return response.data; // Assumes response.data is { user, token }
};

export const signUpUser = async (formData) => {
  const response = await axios.post(`${BASE_URL}auth/signup`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data; // Assumes response.data is { user, token }
};