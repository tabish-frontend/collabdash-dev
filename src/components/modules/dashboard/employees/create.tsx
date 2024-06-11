import React from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts/dashboard";
import { useFormik } from "formik";
import { employeeInitialValues } from "src/formik";
import { employeesApi } from "src/api";
import { useRouter } from "next/router";
import { LoadingButton } from "@mui/lab";
import { AccountStatus } from "src/constants/status";
import { useSettings } from "src/hooks";

const CreateEmployeeComponent = () => {
  const settings = useSettings();

  const router = useRouter();

  const formik = useFormik({
    initialValues: employeeInitialValues,
    onSubmit: async (values, helpers): Promise<void> => {
      await employeesApi.createEmployee(values);
      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      router.back();
    },
  });

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 4,
      }}
    >
      <Container maxWidth={settings.stretch ? false : "xl"}>
        <Stack
          spacing={{
            xs: 3,
            lg: 4,
          }}
        >
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title="Create Employee"
                  titleTypographyProps={{ variant: "h6" }}
                />
                <Divider sx={{ margin: 0 }} />
                <form onSubmit={formik.handleSubmit}>
                  <CardContent>
                    <Grid container spacing={5}>
                      {/* <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          1. Account Details
                        </Typography>
                      </Grid> */}

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          label="Username"
                          name="username"
                          value={formik.values.username}
                          onChange={formik.handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          label="Full Name"
                          name="full_name"
                          value={formik.values.full_name}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          label="Phone No."
                          name="mobile"
                          placeholder="+1-123-456-8790"
                          type="number"
                          value={formik.values.mobile || ""}
                          onChange={formik.handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          type="email"
                          label="Email"
                          name="email"
                          placeholder="johnDoe@example.com"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          type="number"
                          label="Natinal Identity Number"
                          name="national_identity_number"
                          placeholder="Please add NIC"
                          value={formik.values.national_identity_number || ""}
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
                          <FormLabel sx={{ fontSize: "0.875rem" }}>
                            Gender
                          </FormLabel>
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
                    </Grid>
                  </CardContent>
                  <Divider sx={{ margin: 0 }} />
                  <CardActions>
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
                      Submit
                    </LoadingButton>
                    <Button
                      color="secondary"
                      variant="outlined"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                  </CardActions>
                </form>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

const CreateEmployee: NextPage = () => {
  return <CreateEmployeeComponent />;
};

CreateEmployee.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export { CreateEmployee };
