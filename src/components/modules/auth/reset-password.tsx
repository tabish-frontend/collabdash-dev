import { Link, SvgIcon } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import axios from "axios";
import { useFormik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { authApi } from "src/api/auth";
import { RouterLink } from "src/components/shared";
// import { PasswordField } from "src/components/shared/form-fields/password";
import { paths } from "src/constants";
import { useMounted } from "src/hooks";
import { AuthLayout } from "src/layouts";
import * as Yup from "yup";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";

// import { paths } from 'src/paths';

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
  const isMounted = useMounted();
  const { reset_token } = router.query;

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await authApi.resetPassword(reset_token, values);

        if (isMounted()) {
          // const href = paths.auth.index;
          // router.push(href);
          // toast.success("Password reset Sucessfully");
        }
      } catch (error) {
        if (error.response) {
          const htmlResponse = error.response.data;
          const errorMessageStart = "Error: ";
          const errorMessageEnd = "<br>";
          const startIndex = htmlResponse.indexOf(errorMessageStart);
          const endIndex = htmlResponse.indexOf(errorMessageEnd, startIndex);

          if (startIndex !== -1 && endIndex !== -1) {
            const errorMessage = htmlResponse.substring(
              startIndex + errorMessageStart.length,
              endIndex
            );
            toast.error(errorMessage);
          }
        }
        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  return (
    <div>
      {/* <Box sx={{ mb: 4 }}>
        <Link
          color="text.primary"
          component={RouterLink}
          href={paths.auth.index}
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
        </Stack>
        <Button
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting}
        >
          Reset
        </Button>
      </form> */}
    </div>
  );
};

const ResetPassword: NextPage = () => {
  return <ResetPasswordComponent />;
};

ResetPassword.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export { ResetPassword };
