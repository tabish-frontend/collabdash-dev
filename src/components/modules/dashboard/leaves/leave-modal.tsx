import {
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Paper,
  ListItemText,
  Avatar,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { CloseCircleOutline } from "mdi-material-ui";

import { useEffect, useState, type FC } from "react";
import { leaveInitialValues } from "src/formik";

import { employeesApi } from "src/api";
import { LeavesTypes } from "src/constants/status";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { ROLES } from "src/constants/roles";
import { DatePicker } from "@mui/x-date-pickers";

interface LeaveModalProps {
  modal: boolean;
  modalType: string;
  leaveValues: any;
  onConfirm: (values: any) => void;
  onCancel: () => void;
}

export const LeaveModal: FC<LeaveModalProps> = ({
  modal,
  modalType,
  leaveValues,
  onCancel,
  onConfirm,
}) => {
  const { user } = useAuth<AuthContextType>();

  const formik = useFormik({
    initialValues: leaveValues
      ? {
          ...leaveValues,
          startDate: new Date(leaveValues.startDate),
          endDate: new Date(leaveValues.endDate),
          user: leaveValues.user._id,
        }
      : leaveInitialValues,
    enableReinitialize: true,
    onSubmit: async (values, helpers): Promise<void> => {
      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      onConfirm(values);
    },
  });

  // HR ROLE --> STATES AND FUNCTIONS
  const [employees, setEmployees] = useState<any[]>([]);

  const handleGetEmployees = async () => {
    const response = await employeesApi.getAllEmployees("full_name,avatar");
    setEmployees(response.users);
  };

  useEffect(() => {
    if (user?.role === ROLES.Admin || user?.role === ROLES.HR) {
      handleGetEmployees();
    }
  }, [user]);

  return (
    <Dialog fullWidth maxWidth="sm" open={modal} onClose={onCancel}>
      <form onSubmit={formik.handleSubmit}>
        <Paper elevation={12}>
          <DialogTitle sx={{ m: 0, p: 3, fontSize: 24, fontWeight: 600 }}>
            {modalType === "create" ? "Add Leave" : "Update Leave"}
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

          <Grid container spacing={4} p={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Leave Type"
                name="leave_type"
                select
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.leave_type}
              >
                {LeavesTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Leave From Date"
                views={["year", "month", "day"]}
                sx={{ width: "100%" }}
                value={formik.values.startDate}
                onChange={(date) => {
                  if (date) {
                    date.setHours(23, 0, 0, 0);
                    formik.setFieldValue("startDate", date);
                    formik.setFieldValue("endDate", date);
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Leave to Date"
                sx={{ width: "100%" }}
                minDate={formik.values.startDate || new Date()}
                views={["year", "month", "day"]}
                value={formik.values.endDate}
                onChange={(date) => {
                  if (date) {
                    // Set the time to 11 PM
                    date.setHours(23, 0, 0, 0);
                    formik.setFieldValue("endDate", date);
                  }
                }}
              />
            </Grid>

            {(user?.role === ROLES.Admin || user?.role === ROLES.HR) && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Select Employee"
                  name="user"
                  disabled={modalType === "update"}
                  select
                  required
                  onBlur={formik.handleBlur}
                  SelectProps={{
                    MenuProps: {
                      style: {
                        maxHeight: "300px",
                      },
                    },
                  }}
                  onChange={formik.handleChange}
                  value={formik.values.user}
                >
                  {employees.map(({ _id, full_name, avatar }: any) => (
                    <MenuItem key={_id} value={_id}>
                      <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <Avatar
                          alt="user"
                          src={avatar}
                          sx={{ width: "1.5rem", height: "1.5rem", m: 1 }}
                        />
                        <ListItemText primary={full_name} />
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="reason"
                value={formik.values.reason}
                label="Leave Reason"
                multiline
                rows={2}
                onChange={formik.handleChange}
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
            <Button variant="contained" type="submit">
              Save
            </Button>
          </Box>
        </Paper>
      </form>
    </Dialog>
  );
};
