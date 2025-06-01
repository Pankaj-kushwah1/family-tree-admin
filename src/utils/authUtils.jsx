import axios from "axios";

const API_URL = "https://server.rmmbr.me/api/v1";

export const loginAdmin = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/admin/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};


export const allUsersList = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/get-all`);
    console.log("Response auth", response.data)
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

