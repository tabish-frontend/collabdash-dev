// ** React Imports
import { ChangeEvent, ElementType, useState } from "react";

// ** MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

// import Link from '@mui/material/Link'
// import Alert from '@mui/material/Alert'
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// import AlertTitle from '@mui/material/AlertTitle'
// import IconButton from '@mui/material/IconButton'
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Button, { ButtonProps } from "@mui/material/Button";

import { getChangedFields } from "src/utils/helpers";

// ** Icons Imports
// import Close from 'mdi-material-ui/Close'
import { UserAccountDetails } from "src/types";
import { useFormik } from "formik";
import { ImageCrop } from "src/components/shared";
import { AuthContextType } from "src/contexts/auth";
import { useAuth } from "src/hooks";
import { LoadingButton } from "@mui/lab";
import { FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

const ImgStyled = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(3.25),
  borderRadius: theme.shape.borderRadius,
}));

const ButtonStyled = styled(Button)<
  ButtonProps & { component?: ElementType; htmlFor?: string }
>(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    textAlign: "center",
  },
}));

export const TabAccount = () => {
  const { user, updateCurrentUser } = useAuth<AuthContextType>();

  const {
    avatar = "",
    email = "",
    full_name = "",
    username = "",
    designation = "",
    gender = "",
    company = "",
  } = user || {};

  const userDetails = {
    avatar,
    email,
    full_name,
    username,
    designation,
    gender,
    company,
  };

  const formik = useFormik({
    initialValues: userDetails,
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

  const [photoURL, setPhotoURL] = useState(user?.avatar);

  const [modal, setModal] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setPhotoURL(URL.createObjectURL(selectedFile));
      setModal(true);
    } else {
    }
  };

  return (
    <>
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ my: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ImgStyled
                  src={formik.values.avatar || "/images/avatars/1.png"}
                  alt="Profile Pic"
                />
                <Box>
                  <ButtonStyled
                    component="label"
                    variant="contained"
                    htmlFor="account-settings-upload-image"
                  >
                    Upload New Photo
                    <input
                      hidden
                      type="file"
                      accept="image/png, image/jpeg"
                      id="account-settings-upload-image"
                      onChange={handleFileChange}
                    />
                  </ButtonStyled>

                  <Typography variant="body2" sx={{ marginTop: 2 }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                value={formik.values.username}
                name="username"
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={formik.values.full_name}
                name="full_name"
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formik.values.email}
                placeholder="johnDoe@example.com"
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Designation"
                name="designation"
                fullWidth
                value={formik.values.designation}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company"
                placeholder="Please add your company name"
                name="company"
                value={formik.values.company}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl>
                <FormLabel sx={{ fontSize: "0.875rem" }}>Gender</FormLabel>
                <RadioGroup
                  row
                  aria-label="gender"
                  value={formik.values.gender}
                  name="gender"
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="male"
                    label="Male"
                    control={<Radio />}
                  />
                  <FormControlLabel
                    value="female"
                    label="Female"
                    control={<Radio />}
                  />
                </RadioGroup>
              </FormControl>
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

      <ImageCrop
        modal={modal}
        photoURL={photoURL}
        setPhotoURL={setPhotoURL}
        setOpenCrop={setModal}
        onCancel={() => setModal(false)}
      />
    </>
  );
};
