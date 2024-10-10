// ** MUI Imports
import { Grid, TextField, CardContent, Autocomplete } from "@mui/material";

// ** Styled Components
import { UserBankDetails } from "src/types";
import { useFormik } from "formik";
import { getChangedFields } from "src/utils/helpers";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { LoadingButton } from "@mui/lab";
import { UserBankValidation } from "src/formik";
import { handleKeyPress } from "src/utils";

export const TabBank = () => {
  const { user, updateCurrentUser } = useAuth<AuthContextType>();

  const userBankDetails = user?.bank_details || {
    bank_name: "",
    account_holder_name: "",
    iban_number: undefined,
    account_number: undefined,
    city: "",
    branch: "",
  };

  const formik = useFormik({
    initialValues: userBankDetails,
    validationSchema: UserBankValidation,
    enableReinitialize: true,
    onSubmit: async (values, helpers): Promise<void> => {
      const updatingValues = {
        ...getChangedFields<UserBankDetails>(values, formik.initialValues),
      };

      await updateCurrentUser(updatingValues);

      helpers.setSubmitting(false);
    },
  });

  return (
    <CardContent>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Bank Name"
              name="bank_name"
              value={formik.values.bank_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onKeyDown={handleKeyPress}
              error={!!(formik.touched.bank_name && formik.errors.bank_name)}
              helperText={formik.touched.bank_name && formik.errors.bank_name}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Account Holder Name"
              name="account_holder_name"
              value={formik.values.account_holder_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onKeyDown={handleKeyPress}
              error={
                !!(
                  formik.touched.account_holder_name &&
                  formik.errors.account_holder_name
                )
              }
              helperText={
                formik.touched.account_holder_name &&
                formik.errors.account_holder_name
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Account Number"
              name="account_number"
              placeholder="502 5006 900 0969 019"
              value={formik.values.account_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onKeyDown={handleKeyPress}
              error={
                !!(
                  formik.touched.account_number && formik.errors.account_number
                )
              }
              helperText={
                formik.touched.account_number && formik.errors.account_number
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="IBAN Number"
              name="iban_number"
              placeholder="PK90MEZN0099340198443611"
              value={formik.values.iban_number}
              onChange={formik.handleChange}
              onKeyDown={handleKeyPress}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onKeyDown={handleKeyPress}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Branch"
              name="branch"
              value={formik.values.branch}
              onChange={formik.handleChange}
              onKeyDown={handleKeyPress}
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
