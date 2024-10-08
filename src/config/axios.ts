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
    // if (error.response) {
    //   const htmlResponse = error.response.data;
    //   const errorMessageStart = "Error: ";
    //   const errorMessageEnd = "<br>";
    //   const startIndex = htmlResponse.indexOf(errorMessageStart);
    //   const endIndex = htmlResponse.indexOf(errorMessageEnd, startIndex);

    //   const duplicate = htmlResponse.includes("E11000");

    //   const duplicateErrorMap: any = {
    //     email: "Email",
    //     mobile: "Mobile",
    //     meetings: "Meeting",
    //     workspace: "Workspace", // Added Workspace here
    //   };

    //   const getDuplicateErrorMessage = (htmlResponse: any) => {
    //     for (const key in duplicateErrorMap) {
    //       if (htmlResponse.includes(key)) {
    //         return `${duplicateErrorMap[key]} is duplicate. Please enter a different ${duplicateErrorMap[key]}.`;
    //       }
    //     }
    //   };

    //   if (duplicate) {
    //     const errorMessage = getDuplicateErrorMessage(htmlResponse);

    //     toast.error(errorMessage);
    //   } else if (startIndex !== -1 && endIndex !== -1) {
    //     const errorMessage = htmlResponse.substring(
    //       startIndex + errorMessageStart.length,
    //       endIndex
    //     );
    //     toast.error(errorMessage);
    //   } else {
    //   }
    // }

    if (error.response) {
      const htmlResponse = error.response.data;
      const errorMessageStart = "Error: ";
      const errorMessageEnd = "<br>";
      const duplicate = htmlResponse.includes("E11000");

      const duplicateErrorMap: any = {
        email: "Email",
        mobile: "Mobile",
        meetings: "Meeting",
        workspace: "Workspace",
      };

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

      const getDuplicateErrorMessage = (htmlResponse: any) => {
        for (const key in duplicateErrorMap) {
          if (htmlResponse.includes(key)) {
            return `${duplicateErrorMap[key]} is duplicate. Please enter a different ${duplicateErrorMap[key]}.`;
          }
        }
        return null; // Return null if no duplicate error found
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
