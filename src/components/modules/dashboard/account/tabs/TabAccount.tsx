// ** Helpers Imports
import { getChangedFields } from "src/utils/helpers";

// ** Types Imports
import { UserAccountDetails } from "src/types";

// ** Formik Imports
import { useFormik } from "formik";
import { UserAccountValidation } from "src/formik";

// ** Context Imports
import { AuthContextType } from "src/contexts/auth";
import { useAuth } from "src/hooks";

// ** Formfield Imports
import {
  ImageField,
  UsernameField,
  FullNameField,
  EmailField,
  DesignationField,
  CompanyField,
  DepartmentField,
} from "src/components/shared/form-fields";

// ** MUI Imports
import { LoadingButton } from "@mui/lab";
import { Grid, CardContent } from "@mui/material";

export const TabAccount = () => {
  const { user, updateCurrentUser } = useAuth<AuthContextType>();

  const {
    avatar = "",
    email = "",
    full_name = "",
    username = "",
    department = "",
    designation = "",
    company = "",
  } = user || {};

  const userDetails = {
    avatar,
    email,
    full_name,
    username,
    department,
    designation,
    company,
  };

  const formik = useFormik({
    initialValues: userDetails,
    validationSchema: UserAccountValidation,
    enableReinitialize: true,
    onSubmit: async (values, helpers): Promise<void> => {
      const updatingValues = {
        ...getChangedFields<UserAccountDetails>(values, formik.initialValues),
      };

      await updateCurrentUser(updatingValues);

      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
    },
  });

  return (
    <>
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ my: 2 }}>
              <ImageField formikImage={formik.values.avatar} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <UsernameField
                value={formik.values.username}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                formikError={formik.errors.username}
                formikTouched={formik.touched.username}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FullNameField
                value={formik.values.full_name}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                formikError={formik.errors.full_name}
                formikTouched={formik.touched.full_name}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <EmailField
                value={formik.values.email}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                formikError={formik.errors.email}
                formikTouched={formik.touched.email}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CompanyField
                value={formik.values.company}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                formikError={formik.errors.company}
                formikTouched={formik.touched.company}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DepartmentField
                value={formik.values.department}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                formikError={formik.errors.department}
                formikTouched={formik.touched.department}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DesignationField
                value={formik.values.designation}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                formikError={formik.errors.designation}
                formikTouched={formik.touched.designation}
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
        </form>
      </CardContent>
    </>
  );
};
