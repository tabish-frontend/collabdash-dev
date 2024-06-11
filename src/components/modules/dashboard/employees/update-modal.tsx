import {
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { CloseCircleOutline } from "mdi-material-ui";

import { type FC } from "react";
import { AccountStatus } from "src/constants/status";

interface ShiftModalProps {
  modal: boolean;
  employeeValues: {
    username: string;
    designation: string;
    account_status: string;
  };
  onConfirm: (values: any) => void;
  onCancel: () => void;
}

export const UpdateEmployeeModal: FC<ShiftModalProps> = ({
  modal,
  employeeValues,
  onCancel,
  onConfirm,
}) => {
  const formik = useFormik({
    // initialValues: employeeValues,
    initialValues: employeeValues || {
      username: "",
      designation: "",
      account_status: "",
    },
    onSubmit: async (values, helpers): Promise<void> => {
      await onConfirm(values);
      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
    },
  });

  // const getShiftDays = (weekends: string[]) => {
  //   return weekDays.filter(day => !weekends.includes(day))
  // }

  // const handleweekendsChange = (event: SelectChangeEvent<string[]>) => {
  //   const selectedweekends = event.target.value

  //   formik.setFieldValue('weekends', selectedweekends)
  //   const updatedShiftDays = formik.values.times.map(item => {
  //     const filteredDays = item.days.filter(day => !selectedweekends.includes(day))

  //     return { ...item, days: filteredDays }
  //   })

  //   formik.setFieldValue('times', updatedShiftDays)
  // }

  // const addShift = () => {
  //   const newShiftValues = {
  //     start: null,
  //     end: null,
  //     days: []
  //   }

  //   formik.setFieldValue('times', [...formik.values.times, newShiftValues])
  // }

  // const removeShift = (index: number) => {
  //   const updatedShiftValues = [...formik.values.times.slice(0, index), ...formik.values.times.slice(index + 1)]
  //   formik.setFieldValue('times', updatedShiftValues)
  // }

  return (
    <Dialog fullWidth maxWidth={"sm"} open={modal} onClose={onCancel}>
      <form onSubmit={formik.handleSubmit}>
        <Paper elevation={12} sx={{ py: 3 }}>
          <DialogTitle sx={{ m: 0, p: 3, fontSize: 24, fontWeight: 600 }}>
            Update Employee
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

          <Grid container spacing={4} p={4}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Designation"
                name="designation"
                fullWidth
                value={formik.values.designation}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Status"
                fullWidth
                select
                name="account_status"
                value={formik.values.account_status}
                onChange={formik.handleChange}
              >
                {AccountStatus.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
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
