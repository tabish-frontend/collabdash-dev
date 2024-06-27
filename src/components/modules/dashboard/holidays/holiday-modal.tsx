import {
  Autocomplete,
  Badge,
  Checkbox,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  ListItemText,
  MenuItem,
  TextField,
  Paper,
  Avatar,
  Stack,
  Typography,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  Popper,
  styled,
  OutlinedInput,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import { CloseCircleOutline } from "mdi-material-ui";

import { forwardRef, useEffect, useState, type FC } from "react";
import { holidayInitialValues } from "src/formik";

import { employeesApi } from "src/api";
import { Employee, Holiday } from "src/types";
import { DatePicker } from "@mui/x-date-pickers";
import { DepartmentNames } from "src/constants/departments";
import {
  SelectMultipleDepartments,
  SelectMultipleUsers,
} from "src/components/shared";

interface HolidayModalProps {
  modal: boolean;
  modalType: string;
  holidayValues: any;
  onConfirm: (values: any) => void;
  onCancel: () => void;
}

export const HolidayModal: FC<HolidayModalProps> = ({
  modal,
  modalType,
  holidayValues,
  onCancel,
  onConfirm,
}) => {
  const [departments, setDepartments] = useState<string[]>([]);

  const formik = useFormik({
    initialValues: holidayValues
      ? {
          ...holidayValues,
          date: new Date(holidayValues.date),
          users: holidayValues.users.map((user: Holiday) => user._id),
        }
      : holidayInitialValues,

    enableReinitialize: true,
    onSubmit: async (values, helpers): Promise<void> => {
      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      onConfirm(values);
    },
  });

  const [employees, setEmployees] = useState<Employee[]>([]);

  const handleGetEmployees = async () => {
    const response = await employeesApi.getAllEmployees(
      "active",
      "full_name,avatar,department"
    );
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
            {modalType === "create" ? "Add Holiday" : "Update Holiday"}
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
                label="Title"
                value={formik.values.title}
                name="title"
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <DatePicker
                label="Select Date"
                views={["year", "month", "day"]}
                sx={{ width: "100%" }}
                value={formik.values.date}
                onChange={(date) => {
                  if (date) {
                    date.setHours(23, 0, 0, 0);
                    formik.setFieldValue("date", date);
                  }
                }}
              />
            </Grid>

            {modalType === "create" && (
              <Grid item xs={12}>
                <SelectMultipleDepartments
                  departments={departments}
                  handleChange={(event: any, value: any[]) => {
                    setDepartments(value);
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <SelectMultipleUsers
                employees={
                  departments.length
                    ? employees.filter((employee) =>
                        departments.includes(employee.department)
                      )
                    : employees
                }
                formikUsers={formik.values.users}
                setFieldValue={(value: any) =>
                  formik.setFieldValue("users", value)
                }
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
