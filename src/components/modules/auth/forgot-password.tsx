import { LoadingButton } from "@mui/lab";
import { Card, CardContent } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import axios from "axios";
import { useFormik } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { authApi } from "src/api/auth";
import { RouterLink } from "src/components";
import { paths } from "src/constants/paths";
import { useMounted } from "src/hooks";
import { AuthLayout } from "src/layouts";
import * as Yup from "yup";

interface Values {
  email: string;
  submit: null;
}

const initialValues: Values = {
  email: "",
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
});

const ForgotPasswordComponent = () => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers): Promise<void> => {
      await authApi.forgotPassword(values);
      helpers.setStatus({ success: false });
      helpers.setSubmitting(false);
    },
  });

  return (
    <Card elevation={16}>
      <CardContent>
        <Box sx={{ mb: 4 }}>
          <Link
            color="text.primary"
            component={RouterLink}
            href={paths.auth.login}
            sx={{
              alignItems: "center",
              display: "inline-flex",
            }}
            underline="hover"
          >
            <SvgIcon sx={{ mr: 1 }}>
              <ArrowLeftIcon />
            </SvgIcon>
            <Typography variant="subtitle2">Login</Typography>
          </Link>
        </Box>
        <Stack sx={{ mb: 4 }} spacing={1}>
          <Typography variant="h5">Forgot password</Typography>
        </Stack>
        <form noValidate onSubmit={formik.handleSubmit}>
          <TextField
            autoFocus
            error={!!(formik.touched.email && formik.errors.email)}
            fullWidth
            helperText={formik.touched.email && formik.errors.email}
            label="Email Address"
            name="email"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="email"
            value={formik.values.email}
          />
          <LoadingButton
            loading={formik.isSubmitting}
            fullWidth
            size="large"
            loadingPosition="start"
            type="submit"
            sx={{ mt: 3 }}
            variant="contained"
          >
            Send reset link
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
};

const ForgotPassword: NextPage = () => {
  return <ForgotPasswordComponent />;
};

ForgotPassword.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export { ForgotPassword };
