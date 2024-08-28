import { Alert, Box, Button, IconButton, Stack } from "@mui/material";
import { Close } from "mdi-material-ui";

interface ConfirmationAlertProps {
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ConfirmationAlert: React.FC<ConfirmationAlertProps> = ({
  onConfirm,
  onCancel,
  message,
}) => {
  return (
    <Alert
      action={
        <Box sx={{ padding: 0 }}>
          <Stack direction="row">
            <Button
              color="info"
              variant="text"
              size="small"
              onClick={onConfirm}
            >
              Yes
            </Button>
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={onCancel}
            >
              <Close fontSize="inherit" />
            </IconButton>
          </Stack>
        </Box>
      }
      sx={{
        // background: "#092635",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#2e3849" : "#092635",
        color: "#fff",
        position: "relative",
        width: "100%",
        "& .MuiAlert-action": {
          padding: { sm: "0 0 0 16px", xs: "0 0 0 0" },
        },
        fontSize: { sm: 14, xs: 12 },
      }}
      variant="filled"
      severity="warning"
    >
      {message}
    </Alert>
  );
};

export default ConfirmationAlert;
