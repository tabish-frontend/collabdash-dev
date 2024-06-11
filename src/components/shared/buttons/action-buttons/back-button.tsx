import {
  Alert,
  Box,
  Button,
  Collapse,
  IconButton,
  Skeleton,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { SeverityPill } from "../../severity-pill";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import { statusMap } from "src/constants";
import { alpha } from "@mui/system/colorManipulator";
import { useRouter } from "next/router";
import CloseIcon from "@mui/icons-material/Close";
interface BackButtonProps {
  open?: any;
  setOpen?: any;
  handleClick?: any;
  addMode?: boolean;
  isLoading: boolean;
  name: string;
  account_status?: string;
  addModeText?: string;
}
export const BackButton: React.FC<BackButtonProps> = ({
  open,
  setOpen,
  handleClick,
  addMode,
  isLoading,
  name,
  account_status = "active",
  addModeText,
}) => {
  const router = useRouter();
  const statusColor = statusMap[account_status];
  return (
    <>
      <ConfirmationAlert
        open={open}
        confirm={() => router.back()}
        cancel={() => setOpen(false)}
      />
      <Box display="flex">
        <Tooltip title="Back" style={{ marginRight: "1rem" }}>
          <Button onClick={handleClick} color="inherit" size="small">
            <SvgIcon sx={{ mr: 1 }}>
              <ArrowLeftIcon />
            </SvgIcon>
          </Button>
        </Tooltip>
        <Typography variant="h4">
          {addMode ? (
            addModeText
          ) : (
            <span
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {isLoading ? <Skeleton variant="text" width={200} /> : name}
              &nbsp;
              {account_status && (
                <SeverityPill color={statusColor}>
                  {account_status}
                </SeverityPill>
              )}
            </span>
          )}
        </Typography>
      </Box>
    </>
  );
};

interface ConfirmationAlertProps {
  open: boolean;
  confirm: () => void;
  cancel: () => void;
}

const ConfirmationAlert: React.FC<ConfirmationAlertProps> = ({
  open,
  confirm,
  cancel,
}) => {
  const theme = useTheme();

  return (
    <Collapse in={open}>
      <Alert
        action={
          <>
            <Stack spacing={1} justifyContent="center" direction="row">
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={confirm}
              >
                Yes
              </Button>

              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={cancel}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </Stack>
          </>
        }
        sx={{
          backdropFilter: "blur(6px)",
          background: alpha(theme.palette.neutral[700], 0.9),
          color: theme.palette.common.white,
          boxShadow: theme.shadows[16],
          position: "fixed", // Set position to fixed
          top: 70, // Adjust the top position as needed
          width: "75%",
          zIndex: 1000,
          transform: open ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.2s ease-out",
        }}
        variant="filled"
        severity="warning"
      >
        Some Changes occure..... Are you sure you want to leave this page ?
      </Alert>
    </Collapse>
  );
};
