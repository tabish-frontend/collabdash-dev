import { Dialog } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import AlertTriangleIcon from "@untitled-ui/icons-react/build/esm/AlertTriangle";
import type { FC } from "react";

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  modal: boolean;
  content: {
    type: string;
    text: string;
  };
}
export const ConfirmationModal: FC<ConfirmationModalProps> = ({
  onConfirm,
  onCancel,
  modal,
  content,
}) => (
  <Dialog fullWidth maxWidth="sm" open={modal} onClose={onCancel}>
    <Paper elevation={12}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          display: "flex",
          p: 3,
        }}
      >
        <Box
          sx={{
            borderRadius: "50%",
            padding: 1,
            width: "40px",
            height: "40px",
            backgroundColor: "error.lightest",
            color: "error.main",
          }}
        >
          <SvgIcon>
            <AlertTriangleIcon />
          </SvgIcon>
        </Box>
        <div>
          <Typography variant="h5">{content.type}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
            {content.text}
          </Typography>
        </div>
      </Stack>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          pb: 3,
          px: 3,
        }}
      >
        <Button color="inherit" sx={{ mr: 2 }} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          sx={{
            backgroundColor: "error.main",
            "&:hover": {
              backgroundColor: "error.dark",
            },
          }}
          variant="contained"
          onClick={onConfirm}
        >
          {content.type}
        </Button>
      </Box>
    </Paper>
  </Dialog>
);
