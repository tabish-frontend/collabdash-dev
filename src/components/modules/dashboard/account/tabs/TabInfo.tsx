// ** MUI Imports
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import CardContent from "@mui/material/CardContent";

// ** Styled Components
import { UserBasicInformation } from "src/types";
import { useFormik } from "formik";
import { getChangedFields } from "src/utils/helpers";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { LoadingButton } from "@mui/lab";
import { Countries, Languages } from "src/constants/list-items";
import { DatePicker } from "@mui/x-date-pickers";
import {
  MobileField,
  NationalIdentityField,
} from "src/components/shared/form-fields";

export const TabInfo = () => {
  const { user, updateCurrentUser } = useAuth<AuthContextType>();

  const {
    bio = "",
    mobile = "",
    dob: rawDob = null, // Use an alias to avoid conflict with the dob conversion
    country = "",
    national_identity_number = 0,
    qualification = "",
    languages = [],
  } = user || {};

  // Convert dob to a Date object if it exists
  const dob = rawDob ? new Date(rawDob) : null;

  // Combine all properties into userInfo object
  const userInfo = {
    bio,
    mobile,
    dob,
    country,
    national_identity_number,
    qualification,
    languages,
  };

  const formik = useFormik({
    initialValues: userInfo,
    enableReinitialize: true,
    onSubmit: async (values, helpers): Promise<void> => {
      const updatingValues = {
        ...getChangedFields<UserBasicInformation>(values, formik.initialValues),
      };

      await updateCurrentUser(updatingValues);
      helpers.setSubmitting(false);
    },
  });

  return (
    <CardContent>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              label="Bio"
              minRows={2}
              placeholder="Add Bio"
              name="bio"
              value={formik.values.bio}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Date of Birth"
              disableFuture
              sx={{ width: "100%" }}
              views={["year", "month", "day"]}
              value={formik.values.dob}
              onChange={(date) => {
                if (date) {
                  date.setHours(23, 0, 0, 0);
                  formik.setFieldValue("dob", date);
                }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <MobileField
              value={formik.values.mobile}
              handleChange={(...value: any[]) => {
                formik.setFieldValue("mobile", value[3]);
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Qualification"
              name="qualification"
              value={formik.values.qualification}
              placeholder="Graduate"
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Country"
              fullWidth
              select
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
            >
              {Countries.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Languages"
              fullWidth
              select
              name="languages"
              value={formik.values.languages}
              SelectProps={{
                multiple: true,
                value: formik.values.languages,
                onChange: formik.handleChange,
              }}
            >
              {Languages.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <NationalIdentityField
              value={formik.values.national_identity_number}
              handleChange={formik.handleChange}
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
  );
};
