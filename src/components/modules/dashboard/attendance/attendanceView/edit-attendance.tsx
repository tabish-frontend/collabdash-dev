import {
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  FormHelperText,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { CloseCircleOutline } from "mdi-material-ui";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, type FC } from "react";

import { TimePicker } from "@mui/x-date-pickers";
import * as Yup from "yup";

interface EditAttendanceModalProps {
  attendanceValues: any;
  modal: boolean;
  onConfirm: (values: any) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object({
  clockInTime: Yup.date().required("Start Time is required"),
  clockOutTime: Yup.date()
    .nullable()
    .test(
      "is-greater",
      "End Time must be later than Start Time",
      function (value) {
        const { clockInTime } = this.parent;
        return !value || (clockInTime && value > clockInTime);
      }
    ),
});

export const EditAttendanceModal: FC<EditAttendanceModalProps> = ({
  modal,
  attendanceValues,
  onCancel,
  onConfirm,
}) => {
  const formik = useFormik({
    initialValues: attendanceValues,
    validationSchema: validationSchema,
    onSubmit: async (values, helpers): Promise<void> => {
      onConfirm(values);
      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
    },
  });

  useEffect(() => {
    console.log("formik values", formik.values);
  }, [formik.values]);

  // console.log("attendanceValues", attendanceValues);

  const combineDateAndTime = (originalDate: Date, newTime: Date): Date => {
    const updatedDate = new Date(originalDate);
    updatedDate.setHours(newTime.getHours());
    updatedDate.setMinutes(newTime.getMinutes());
    updatedDate.setSeconds(newTime.getSeconds());
    updatedDate.setMilliseconds(newTime.getMilliseconds());
    return updatedDate;
  };

  return (
    <Dialog fullWidth maxWidth={"sm"} open={modal} onClose={onCancel}>
      <Paper elevation={12}>
        <DialogTitle sx={{ m: 0, p: 3, fontSize: 24, fontWeight: 600 }}>
          {"Update Attendance"}
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

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} p={2}>
            <Grid item xs={12}>
              <TimePicker
                sx={{ width: "100%" }}
                label="Start Time"
                value={formik.values.clockInTime}
                onChange={(time: Date | null) => {
                  if (time) {
                    const originalDate = new Date(formik.values.clockInTime);
                    const combinedDateTime = combineDateAndTime(
                      originalDate,
                      time
                    );
                    formik.setFieldValue("clockInTime", combinedDateTime);
                  }
                }}
              />
              {!!(formik.touched.clockInTime && formik.errors.clockInTime) && (
                <FormHelperText error>
                  {formik.errors.clockInTime as string}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12} sx={{ position: "relative" }}>
                <TimePicker
                  sx={{ width: "100%" }}
                  label="End Time"
                  value={formik.values.clockOutTime}
                  onChange={(time: Date | null) => {
                    if (time) {
                      const originalDate = formik.values.clockOutTime
                        ? new Date(formik.values.clockOutTime)
                        : new Date(formik.values.clockInTime);
                      const combinedDateTime = combineDateAndTime(
                        originalDate,
                        time
                      );
                      formik.setFieldValue("clockOutTime", combinedDateTime);
                    }
                  }}
                />
                {formik.values.clockOutTime && (
                  <IconButton
                    sx={{ position: "absolute", right: "40px", top: "21%" }}
                    edge="end"
                    size="small"
                    onClick={() => formik.setFieldValue("clockOutTime", null)}
                  >
                    <CloseCircleOutline />
                  </IconButton>
                )}
                {/* <ClearIcon /> */}
              </Grid>

              {!!(
                formik.touched.clockOutTime && formik.errors.clockOutTime
              ) && (
                <FormHelperText error>
                  {formik.errors.clockOutTime as string}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  pb: 3,
                }}
              >
                <Button color="inherit" sx={{ mr: 2 }} onClick={onCancel}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit">
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Dialog>
  );
};
