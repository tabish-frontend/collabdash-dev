// ** MUI Imports
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import CardContent from "@mui/material/CardContent";

// ** Styled Components
import { UserBasicInformation } from "src/types";
import { useFormik } from "formik";
import { getChangedFields, getTimeZones } from "src/utils/helpers";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { LoadingButton } from "@mui/lab";
import { Languages } from "src/constants/list-items";
import { DatePicker } from "@mui/x-date-pickers";
import {
  CountryField,
  GenderField,
  MobileField,
  NationalIdentityField,
  TimeZoneField,
} from "src/components/shared/form-fields";
import { useEffect, useState } from "react";

export const TabInfo = () => {
  const { user, updateCurrentUser } = useAuth<AuthContextType>();

  const [userTimeZones, setUserTimeZones] = useState<any[] | undefined>([]);

  const {
    bio = "",
    mobile = "",
    dob: rawDob = null, // Use an alias to avoid conflict with the dob conversion
    national_identity_number = 0,
    qualification = "",
    languages = [],
    gender = "",
    country = "",
    time_zone = {
      name: "",
      value: "",
    },
  } = user || {};

  // Convert dob to a Date object if it exists
  const dob = rawDob ? new Date(rawDob) : null;

  // Combine all properties into userInfo object
  const userInfo = {
    bio,
    mobile,
    dob,
    country,
    gender,
    national_identity_number,
    qualification,
    languages,
    time_zone,
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

  useEffect(() => {
    getTimeZones(userInfo.country, setUserTimeZones);
  }, [user, userInfo.country]);

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
            <GenderField
              value={formik.values.gender}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              formikTouched={formik.touched.gender}
              formikError={formik.errors.gender}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <NationalIdentityField
              value={formik.values.national_identity_number}
              handleChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CountryField
              value={formik.values.country}
              handleChange={(e: any) => {
                formik.handleChange(e);
                getTimeZones(e.target.value, setUserTimeZones);
                formik.setFieldValue("time_zone", {
                  name: "",
                  value: "",
                });
              }}
              handleBlur={formik.handleBlur}
              formikError={formik.errors.country}
              formikTouched={formik.touched.country}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TimeZoneField
              name={"time_zone.value"}
              is_disable={!formik.values.country}
              handleBlur={formik.handleBlur}
              formikError={formik.errors.time_zone?.value}
              formikTouched={formik.touched.time_zone?.value}
              value={formik.values.time_zone.value}
              TimeZones={userTimeZones}
              setFieldValue={(value: any) => {
                return formik.setFieldValue("time_zone", value);
              }}
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
