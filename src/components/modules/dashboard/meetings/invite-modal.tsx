import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Stack,
  Paper,
  IconButton,
  Divider,
  Grid,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { CloseCircleOutline } from "mdi-material-ui";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

interface InviteDialogProps {
  open: boolean;
  onClose: () => void;
}

export const InviteModal: FC<InviteDialogProps> = ({ open, onClose }) => {
  const [emails, setEmails] = useState([""]);

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = value;
    setEmails(updatedEmails);
  };

  const handleSendInvite = () => {
    // Pass emails back to parent to handle invite logic
    onClose(); // Close the dialog
  };

  const handleAddEmail = () => {
    setEmails((prev) => [...prev, ""]);
  };

  const handleRemoveEmailField = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{ "& .MuiPaper-root": { overflowY: "unset" } }}
    >
      <form>
        <Paper elevation={12}>
          <DialogTitle sx={{ m: 0, p: 3, fontSize: 24, fontWeight: 600 }}>
            Invite People
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 12,
              top: 16,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseCircleOutline />
          </IconButton>

          <Divider />
          <Grid container spacing={2} p={2}>
            {emails.map((email, index) => (
              <Grid item xs={12} key={index}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <TextField
                    label="Email"
                    size="small"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    fullWidth
                    name="email"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleAddEmail}
                  >
                    Add
                  </Button>
                  {emails.length > 1 && (
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveEmailField(index)}
                    >
                      <CancelOutlinedIcon />
                    </IconButton>
                  )}
                </Stack>
              </Grid>
            ))}
          </Grid>
          <DialogActions>
            <Stack direction={"row"} justifyContent={"center"} width={"100%"}>
              <Button
                onClick={handleSendInvite}
                variant="contained"
                color="primary"
                sx={{ width: 200 }}
                fullWidth
              >
                Send Invitation
              </Button>
            </Stack>
          </DialogActions>
        </Paper>
      </form>
    </Dialog>
  );
};
