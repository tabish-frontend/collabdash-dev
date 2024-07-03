import { LoadingButton } from "@mui/lab";
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
import { DesignationField, EmailField } from "src/components/shared";
import { AccountStatus } from "src/constants/status";
import { common_user_validation } from "src/formik";
import * as Yup from "yup";

interface ShiftModalProps {
  modal: boolean;
  employeeValues: {
    username: string;
    designation: string;
    account_status: string;
    email: string;
  };
  onConfirm: (values: any) => void;
  onCancel: () => void;
}

const UpdateEmployeeValidation = Yup.object().shape({
  email: common_user_validation.email,
  designation: common_user_validation.designation,
});

export const UpdateEmployeeModal: FC<ShiftModalProps> = ({
  modal,
  employeeValues,
  onCancel,
  onConfirm,
}) => {
  const formik = useFormik({
    initialValues: employeeValues || {
      username: "",
      designation: "",
      account_status: "",
      email: "",
    },
    validationSchema: UpdateEmployeeValidation,
    onSubmit: async (values, helpers): Promise<void> => {
      await onConfirm(values);
      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
    },
  });

  return (
    <Dialog fullWidth maxWidth={"sm"} open={modal} onClose={onCancel}>
      <form onSubmit={formik.handleSubmit}>
        <Paper elevation={12}>
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

          <Grid container spacing={2} p={2}>
            <Grid item xs={12}>
              <EmailField
                value={formik.values.email}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                formikError={formik.errors.email}
                formikTouched={formik.touched.email}
              />
            </Grid>

            <Grid item xs={12}>
              <DesignationField
                value={formik.values.designation}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                formikError={formik.errors.designation}
                formikTouched={formik.touched.designation}
              />
            </Grid>
            <Grid item xs={12}>
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
