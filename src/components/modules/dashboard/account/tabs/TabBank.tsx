// ** MUI Imports
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import CardContent from "@mui/material/CardContent";

// ** Styled Components
import { UserBankDetails } from "src/types";
import { useFormik } from "formik";
import { getChangedFields } from "src/utils/helpers";
import { BankNames } from "src/constants/bank-names";
import { useAuth } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { Autocomplete, LoadingButton } from "@mui/lab";

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
            <Autocomplete
              disablePortal
              options={BankNames}
              fullWidth
              ListboxProps={{ style: { maxHeight: 250 } }}
              renderInput={(params) => (
                <TextField {...params} label="Bank Name" required />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Account Holder Name"
              required
              value={formik.values.account_holder_name}
              name="account_holder_name"
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              type="number"
              label="Account Number"
              name="account_number"
              value={formik.values.account_number}
              placeholder="9946 010 9864 896"
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="IBAN Number"
              name="iban_number"
              value={formik.values.iban_number}
              placeholder="PK90MEZN0099340198443611"
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Branch"
              name="branch"
              value={formik.values.branch}
              onChange={formik.handleChange}
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
