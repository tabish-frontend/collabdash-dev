import type { FC } from "react";
import { useTheme } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Toaster: FC = () => {
  const theme = useTheme();

  return (
    // <HotToaster
    //   position="bottom-right"
    //   toastOptions={{
    //     style: {
    //       backdropFilter: "blur(6px)",
    //       background: alpha(theme.palette.neutral[900], 0.8),
    //       color: theme.palette.common.white,
    //       boxShadow: theme.shadows[16],
    //     },
    //   }}
    // />
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick={true}
      pauseOnHover={true}
      draggable={true}
      theme="dark"

      // position: "bottom-right",
      //       autoClose: 5000,
      //       hideProgressBar: false,
      //       closeOnClick: true,
      //       pauseOnHover: true,
      //       draggable: true,
      //       progress: undefined,
      //       theme: "dark",
    />
  );
};
