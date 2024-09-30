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
import { FormikValues, useFormik } from "formik";
import { CloseCircleOutline } from "mdi-material-ui";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, type FC } from "react";

import { TimePicker } from "@mui/x-date-pickers";
import * as Yup from "yup";
import dayjs, { Dayjs } from "dayjs";
import { LoadingButton } from "@mui/lab";

interface EditAttendanceModalProps {
  attendanceValues: any;
  modal: boolean;
  onConfirm: (values: any) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object({
  clockInTime: Yup.date().required("clockIn Time is required"),
  clockOutTime: Yup.date()
    .nullable()
    .test(
      "is-greater",
      "clockOut time must be greater than clockIn Time",
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
      await onConfirm(values);
      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      onCancel();
    },
  });

  const handleTimeChange = (field: string) => (time: Date | null) => {
    if (time) {
      const originalDate =
        field === "clockOutTime" && formik.values.clockOutTime
          ? dayjs(formik.values.clockOutTime)
          : dayjs(formik.values.clockInTime);

      const dayjsTime = dayjs(time);

      const combinedDateTime = originalDate
        .hour(dayjsTime.hour())
        .minute(dayjsTime.minute())
        .second(dayjsTime.second())
        .millisecond(dayjsTime.millisecond())
        .toDate();

      formik.setFieldValue(field, combinedDateTime);
    }
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
                onChange={handleTimeChange("clockInTime")}
              />

              {!!(formik.touched.clockInTime && formik.errors.clockInTime) && (
                <FormHelperText error>
                  {formik.errors.clockInTime as string}
                </FormHelperText>
              )}
            </Grid>

            <Grid item xs={12} sx={{ position: "relative" }}>
              <TimePicker
                sx={{ width: "100%" }}
                label="End Time"
                value={formik.values.clockOutTime}
                onChange={handleTimeChange("clockOutTime")}
              />

              {formik.values.clockOutTime && (
                <IconButton
                  color="error"
                  sx={{ position: "absolute", right: 45, top: 23 }}
                  onClick={() => formik.setFieldValue("clockOutTime", null)}
                >
                  <CloseCircleOutline />
                </IconButton>
              )}

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
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Dialog>
  );
};
