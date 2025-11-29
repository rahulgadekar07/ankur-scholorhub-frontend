import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_URL;
// Submit contact form (feedback)
export const submitContactForm = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}other/submit-feedback`, formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

// (Optional) Fetch all feedbacks — for admin dashboard
export const getAllFeedbacks = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/get-feedbacks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    throw error.response?.data || { message: "Failed to fetch feedbacks" };
  }
};
