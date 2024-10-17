import axios from "axios";

import { toast } from "react-toastify";

const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

Axios.interceptors.request.use(
  (config) => {
    // You can modify the request config here if needed

    const token = localStorage.getItem("accessToken");

    config.headers["Authorization"] = `Bearer ${token}`;

    return config;
  },
  (error) => {
    // Handle request error

    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  (response: any) => {
    response.data.message && toast.success(response.data.message);

    return response.data;
  },
  (error) => {
    if (error.response) {
      const htmlResponse = error.response.data;
      const errorMessageStart = "Error: ";
      const errorMessageEnd = "<br>";
      const duplicate = htmlResponse.includes("E11000");

      // Function to extract the main error message
      const getErrorMessage = (htmlResponse: any) => {
        const startIndex = htmlResponse.indexOf(errorMessageStart);
        const endIndex = htmlResponse.indexOf(errorMessageEnd, startIndex);

        if (startIndex !== -1 && endIndex !== -1) {
          return htmlResponse.substring(
            startIndex + errorMessageStart.length,
            endIndex
          );
        }
        return null; // Return null if no error message found
      };

      // Function to extract the field causing the duplicate error dynamically
      const getDuplicateField = (htmlResponse: any) => {
        const regex = /index: (\w+)_1/; // Regex to match the duplicate field, e.g., "email_1"
        const match = htmlResponse.match(regex);
        return match ? match[1] : null; // Extract the field name
      };

      // Function to generate the duplicate error message dynamically
      const getDuplicateErrorMessage = (htmlResponse: any) => {
        const field = getDuplicateField(htmlResponse);

        if (field) {
          // Capitalize the field name (optional)
          const formattedField = field.charAt(0).toUpperCase() + field.slice(1);
          return `${formattedField} is duplicate. Please enter a different ${formattedField}.`;
        }
        return `An item is duplicate. Please enter a different item.`;
      };

      const errorMessage = duplicate
        ? getDuplicateErrorMessage(htmlResponse)
        : getErrorMessage(htmlResponse);

      // Show the appropriate error message if one is found
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }

    return Promise.reject(error);
  }
);

export default Axios;
