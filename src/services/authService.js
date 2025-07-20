import axios from "axios";
const BASE_URL = "https://ankur-scholorhub-backend-aehg.onrender.com/api/";

export const loginUser = async ({ email, password }) => {
  const response = await axios.post(`${BASE_URL}auth/login`, {
    email,
    password,
  });
  return response.data;
};
