import { useFormik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { authApi } from "src/api/auth";
import { PasswordField, RouterLink } from "src/components/shared";
import { paths } from "src/constants/paths";
import { AuthLayout } from "src/layouts";
import * as Yup from "yup";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import {
  Typography,
  Box,
  Stack,
  Button,
  Card,
  CardContent,
  Link,
  SvgIcon,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

interface Values {
  password: string;
  password_confirm: string;
}

const initialValues: Values = {
  password: "",
  password_confirm: "",
};

const validationSchema = Yup.object({
  password: Yup.string()
    .required("New Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase(A-Z), One Lowercase(a-z), One Number(0-9) and special case Character(e.g. !@#$%^&*)"
    ),
  password_confirm: Yup.string()
    .required("Please re-type your password")
    .oneOf([Yup.ref("password")], "Passwords does not match"),
});

const ResetPasswordComponent = () => {
  const router = useRouter();
  const { reset_token } = router.query;

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await authApi.resetPassword(reset_token, { password: values.password });
        const href = paths.auth.login;
        router.push(href);
      } catch (error) {
        helpers.setStatus({ success: false });
        helpers.setSubmitting(false);
      }
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
          <Typography variant="h5">Reset password</Typography>
        </Stack>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <PasswordField
              formikErrors={formik.errors.password}
              formikTouched={formik.touched.password}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              label={"Password"}
              name={"password"}
              values={formik.values.password}
            />
            <PasswordField
              formikErrors={formik.errors.password_confirm}
              formikTouched={formik.touched.password_confirm}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              label={"Confirm Password"}
              name={"password_confirm"}
              values={formik.values.password_confirm}
            />

            <LoadingButton
              fullWidth
              size="large"
              variant="contained"
              type="submit"
              loadingPosition="start"
              loading={formik.isSubmitting}
              startIcon={<></>}
              sx={{ pl: formik.isSubmitting ? "40px" : "16px" }}
            >
              Reset
            </LoadingButton>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

const ResetPassword: NextPage = () => {
  return <ResetPasswordComponent />;
};

ResetPassword.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export { ResetPassword };
