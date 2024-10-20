import React, { useEffect, useState } from "react";
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
  Stack,
} from "@mui/material";
import { NextPage } from "next";
import { DashboardLayout } from "src/layouts/dashboard";
import { useFormik } from "formik";
import { employeeInitialValues, employeeValidation } from "src/formik";
import { employeesApi } from "src/api";
import { useRouter } from "next/router";
import { LoadingButton } from "@mui/lab";
import { useSettings } from "src/hooks";
import {
  CompanyField,
  DesignationField,
  EmailField,
  FullNameField,
  GenderField,
  MobileField,
  UsernameField,
  DepartmentField,
  CountryField,
  TimeZoneField,
  AccountRoleField,
  IdentityTypeField,
  IdentityNumberField,
} from "src/components/shared/form-fields";
import { getTimeZones } from "src/utils";

const CreateEmployeeComponent = () => {
  const settings = useSettings();

  const router = useRouter();

  const [userTimeZones, setUserTimeZones] = useState<any[] | undefined>([]);

  const formik = useFormik({
    initialValues: employeeInitialValues,
    validationSchema: employeeValidation,
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
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  title="Add Employee"
                  titleTypographyProps={{ variant: "h6" }}
                />
                <Divider sx={{ margin: 0 }} />
                <form onSubmit={formik.handleSubmit}>
                  <CardContent>
                    <Grid container spacing={2}>
                      {/* <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          1. Account Details
                        </Typography>
                      </Grid> */}

                      <Grid item xs={12} sm={6} md={3} lg={3}>
                        <FullNameField
                          value={formik.values.full_name}
                          handleChange={formik.handleChange}
                          handleBlur={formik.handleBlur}
                          formikError={formik.errors.full_name}
                          formikTouched={formik.touched.full_name}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3} lg={3}>
                        <EmailField
                          value={formik.values.email}
                          handleChange={(e: any) => {
                            const value = e.target.value.trim();
                            formik.setFieldValue("email", value);
                            formik.setFieldValue(
                              "username",
                              value.split("@")[0]
                            );
                          }}
                          handleBlur={formik.handleBlur}
                          formikError={formik.errors.email}
                          formikTouched={formik.touched.email}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3} lg={3}>
                        <UsernameField
                          value={formik.values.username}
                          handleChange={formik.handleChange}
                          handleBlur={formik.handleBlur}
                          formikError={formik.errors.username}
                          formikTouched={formik.touched.username}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3} lg={3}>
                        <MobileField
                          value={formik.values.mobile}
                          handleChange={(...value: any[]) => {
                            formik.setFieldValue("mobile", value[0]);
                          }}
                          handleBlur={formik.handleBlur}
                          formikError={formik.errors.mobile}
                          formikTouched={formik.touched.mobile}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <CompanyField
                          value={formik.values.company}
                          handleChange={formik.handleChange}
                          handleBlur={formik.handleBlur}
                          formikError={formik.errors.company}
                          formikTouched={formik.touched.company}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <DepartmentField
                          value={formik.values.department}
                          handleChange={formik.handleChange}
                          handleBlur={formik.handleBlur}
                          formikError={formik.errors.department}
                          formikTouched={formik.touched.department}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <DesignationField
                          value={formik.values.designation}
                          handleChange={formik.handleChange}
                          handleBlur={formik.handleBlur}
                          formikError={formik.errors.designation}
                          formikTouched={formik.touched.designation}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
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

                      <Grid item xs={12} sm={4}>
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

                      <Grid item xs={12} sm={4}>
                        <AccountRoleField
                          value={formik.values.role}
                          handleChange={formik.handleChange}
                          handleBlur={formik.handleBlur}
                          formikTouched={formik.touched.role}
                          formikError={formik.errors.role}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <GenderField
                          value={formik.values.gender}
                          handleChange={formik.handleChange}
                          handleBlur={formik.handleBlur}
                          formikTouched={formik.touched.gender}
                          formikError={formik.errors.gender}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <IdentityTypeField
                          value={formik.values.identity_type}
                          handleChange={formik.handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <IdentityNumberField
                          value={formik.values.identity_number}
                          handleChange={formik.handleChange}
                        />
                      </Grid>

                      {/* <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          2. Shift Details
                        </Typography>
                      </Grid> */}
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
