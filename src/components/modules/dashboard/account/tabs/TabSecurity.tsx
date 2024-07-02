// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";

// ** Icons Imports

import { PasswordField } from "src/components/shared/form-fields";
import { useFormik } from "formik";
import { UpdateMyPassword, ResetPasswordValidation } from "src/formik";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { paths } from "src/constants/paths";
import { useRouter } from "next/router";
import { LoadingButton } from "@mui/lab";

export const TabSecurity = () => {
  const { changePassword } = useAuth<AuthContextType>();

  const router = useRouter();

  // ** Formik
  const formik = useFormik({
    initialValues: UpdateMyPassword,
    validationSchema: ResetPasswordValidation,
    onSubmit: async (values, helpers): Promise<void> => {
      await changePassword(values);
      router.push(paths.auth.login);
      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      formik.handleReset(formik.initialValues);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <PasswordField
                  handleChange={formik.handleChange}
                  label={"Current Password"}
                  name={"current_password"}
                  values={formik.values.current_password}
                  formikErrors={formik.errors.current_password}
                  formikTouched={formik.touched.current_password}
                  handleBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={12}>
                <PasswordField
                  handleChange={formik.handleChange}
                  label={"New Password"}
                  name={"password"}
                  values={formik.values.password}
                  formikErrors={formik.errors.password}
                  formikTouched={formik.touched.password}
                  handleBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={12}>
                <PasswordField
                  handleChange={formik.handleChange}
                  label={"Confirm Password"}
                  name={"password_confirm"}
                  values={formik.values.password_confirm}
                  formikErrors={formik.errors.password_confirm}
                  formikTouched={formik.touched.password_confirm}
                  handleBlur={formik.handleBlur}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              marginTop: [7.5, 2.5],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              width={183}
              alt="avatar"
              height={256}
              src="/images/pages/pose-m-1.png"
            />
          </Grid>

          <Grid item xs={12}>
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
              Save Changes
            </LoadingButton>
          </Grid>
        </Grid>
      </CardContent>

      {/* <CardContent></CardContent> */}
    </form>
  );
};
