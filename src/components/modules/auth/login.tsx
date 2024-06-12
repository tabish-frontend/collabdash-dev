import type { NextPage } from "next";
import * as Yup from "yup";
import { useFormik } from "formik";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Seo } from "src/components/shared/seo";
import { AuthLayout } from "src/layouts";
import { paths } from "src/constants/paths";
import { useAuth, useRouter } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { LoginInitialValues } from "src/formik";
import { PasswordField, RouterLink } from "src/components/shared";
import { LoadingButton } from "@mui/lab";

const LoginComponent: NextPage = () => {
  const router = useRouter();

  const { signIn } = useAuth<AuthContextType>();

  const formik = useFormik({
    initialValues: LoginInitialValues,
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await signIn(values);
        router.push(paths.index);
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Card elevation={16}>
        <CardHeader title={<Typography variant="h5">Log in</Typography>} />
        <CardContent>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
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

              <PasswordField
                handleChange={formik.handleChange}
                label="Password"
                name="password"
                values={formik.values.password}
                formikErrors={formik.errors.password}
                formikTouched={formik.touched.password}
                handleBlur={formik.handleBlur}
              />
            </Stack>
            <LoadingButton
              loading={formik.isSubmitting}
              fullWidth
              startIcon={<></>}
              loadingPosition="start"
              type="submit"
              sx={{ mt: 3 }}
              size="large"
              variant="contained"
            >
              Log In
            </LoadingButton>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 3,
              }}
            >
              <Link
                component={RouterLink}
                href={paths.auth.forgot_password}
                underline="hover"
                variant="subtitle2"
              >
                Forgot password?
              </Link>
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

const Login: NextPage = () => {
  return <LoginComponent />;
};

Login.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export { Login };
