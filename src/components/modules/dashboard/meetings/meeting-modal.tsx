import {
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  TextField,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { CloseCircleOutline } from "mdi-material-ui";
import { useEffect, useState, type FC } from "react";
import { employeesApi } from "src/api";
import { Employee, Meeting, WorkSpace } from "src/types";
import { SelectMultipleUsers } from "src/components/shared";
import { LoadingButton } from "@mui/lab";
import { DateTimePicker } from "@mui/x-date-pickers";

interface MeetingModalProps {
  modal: boolean;
  modalType?: string;
  meetingValues: Meeting;
  onCancel: () => void;
  onSubmit: (values: Meeting) => void;
}

export const MeetingModal: FC<MeetingModalProps> = ({
  modal,
  modalType,
  meetingValues,
  onCancel,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues: meetingValues,
    enableReinitialize: true,
    onSubmit: async (values, helpers): Promise<void> => {
      await onSubmit(values);
      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
    },
  });

  const [employees, setEmployees] = useState<Employee[]>([]);

  const handleGetEmployees = async () => {
    const response = await employeesApi.getAllEmployees({
      fields: "full_name,avatar,department",
      account_status: "active",
      search: "",
      role: "",
    });
    setEmployees(response.users);
  };

  useEffect(() => {
    handleGetEmployees();
  }, []);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={modal}
      onClose={onCancel}
      sx={{ "& .MuiPaper-root": { overflowY: "unset" } }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Paper elevation={12}>
          <DialogTitle sx={{ m: 0, p: 3, fontSize: 24, fontWeight: 600 }}>
            {`${modalType} Meeting`}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onCancel}
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meeting Title"
                required
                value={formik.values.title}
                name="title"
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <SelectMultipleUsers
                label="Select Participants"
                employees={employees}
                isRequired={!formik.values.participants.length}
                formikUsers={formik.values.participants.map(
                  (user: any) => user._id
                )}
                setFieldValue={(value: any) =>
                  formik.setFieldValue("participants", value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <DateTimePicker
                sx={{ width: "100%" }}
                label="Select Date and Time"
                value={formik.values.time}
                onChange={(date: Date | null) => {
                  formik.setFieldValue("time", date);
                }}
              />
            </Grid>
          </Grid>

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

            <LoadingButton
              loading={formik.isSubmitting}
              loadingPosition="start"
              startIcon={<></>}
              type="submit"
              variant="contained"
              sx={{
                pl: formik.isSubmitting ? "40px" : "16px",
              }}
            >
              Save
            </LoadingButton>
          </Box>
        </Paper>
      </form>
    </Dialog>
  );
};
