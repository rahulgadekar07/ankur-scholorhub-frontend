import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL; // e.g. "https://your-backend-url.com/api/"

// ✅ Helper to attach token automatically
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ✅ Fetch all users (Admin only)
export const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${baseUrl}admin/users`, getAuthHeaders());
    return response.data; // expected: { success, data: [...] }
  } catch (error) {
    console.error("Fetch users error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch users" };
  }
};

// ✅ Block a user
export const blockUser = async (id) => {
  try {
    const response = await axios.put(`${baseUrl}admin/block/${id}`, {}, getAuthHeaders());
    return response.data; // expected: { success, message }
  } catch (error) {
    console.error("Block user error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to block user" };
  }
};

// ✅ Unblock a user
export const unblockUser = async (id) => {
  try {
    const response = await axios.put(`${baseUrl}admin/unblock/${id}`, {}, getAuthHeaders());
    return response.data; // expected: { success, message }
  } catch (error) {
    console.error("Unblock user error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to unblock user" };
  }
};
