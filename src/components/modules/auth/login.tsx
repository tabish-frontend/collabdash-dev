// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import Link from "@mui/material/Link";
// import Stack from "@mui/material/Stack";
// import TextField from "@mui/material/TextField";
// import Typography from "@mui/material/Typography";
// import { useFormik } from "formik";
// import type { NextPage } from "next";
// import { AuthLayout } from "src/layouts";
// import * as Yup from "yup";

// import { paths } from "src/constants";
// import { authApi } from "src/api/auth";
// import { useMounted } from "src/hooks";
// import { useRouter } from "next/router";
// import { useSearchParams } from "next/navigation";
// import { useReducer, useCallback, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useAuth } from "src/hooks/use-auth";
// import { AuthContextType } from "src/contexts/auth/jwt";
// import { PasswordField } from "src/components/shared/form-fields/password";
// import { LoadingButton } from "@mui/lab";
// import { RouterLink } from "src/components/shared";
// // import { isAuthenticated } from "src/hooks/use-auth";

// interface Values {
//   email: string;
//   password: string;
//   submit: null;
// }

// const initialValues: Values = {
//   email: "",
//   password: "",
//   submit: null,
// };

// const validationSchema = Yup.object({
//   email: Yup.string()
//     .email("Must be a valid email")
//     .max(255)
//     .required("Email is required"),

//   password: Yup.string()
//     .max(255)
//     .required("Password is required")
//     .min(8, "Password must have at least 8 characters"),
// });

// const LoginComponent = () => {
//   const isMounted = useMounted();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const returnTo = searchParams.get("returnTo");
//   const { signIn } = useAuth<AuthContextType>();

//   const formik = useFormik({
//     initialValues,
//     validationSchema,
//     onSubmit: async (values, helpers): Promise<void> => {
//       try {
//         await signIn(values.email, values.password);

//         if (isMounted()) {
//           router.push(returnTo || paths.dashboard);
//         }
//       } catch (err) {
//         if (isMounted()) {
//           helpers.setStatus({ success: false });
//           helpers.setErrors({ submit: err.message });
//           helpers.setSubmitting(false);
//         }
//       }
//     },
//   });

//   return (
//     <div>
//       <Stack sx={{ mb: 4 }} spacing={1}>
//         <Typography variant="h5">Log in</Typography>
//         {/* <Typography color="text.secondary" variant="body2">
//           Don&apos;t have an account? &nbsp;
//           <Link
//             href={paths.auth.register}
//             underline="hover"
//             variant="subtitle2"
//           >
//             Register
//           </Link>
//         </Typography> */}
//       </Stack>
//       <form noValidate onSubmit={formik.handleSubmit}>
//         <Stack spacing={3}>
//           <TextField
//             autoFocus
//             error={!!(formik.touched.email && formik.errors.email)}
//             fullWidth
//             helperText={formik.touched.email && formik.errors.email}
//             label="Email Address"
//             name="email"
//             onBlur={formik.handleBlur}
//             onChange={formik.handleChange}
//             type="email"
//             value={formik.values.email}
//           />
//           <PasswordField
//             formikErrors={formik.errors.password}
//             formikTouched={formik.touched.password}
//             handleChange={formik.handleChange}
//             handleBlur={formik.handleBlur}
//             label={"Password"}
//             name={"password"}
//             values={formik.values.password}
//           />
//         </Stack>
//         <LoadingButton
//           loading={formik.isSubmitting}
//           fullWidth
//           startIcon={<></>}
//           loadingPosition="start"
//           type="submit"
//           sx={{ mt: 3 }}
//           size="large"
//           variant="contained"
//         >
//           Log In
//         </LoadingButton>
//         <Box sx={{ mt: 3 }}>
//           <Link
//             component={RouterLink}
//             href={paths.auth.forgot_password}
//             underline="hover"
//             variant="subtitle2"
//           >
//             Forgot password?
//           </Link>
//         </Box>
//       </form>
//     </div>
//   );
// };

// const Login: NextPage = () => {
//   return <LoginComponent />;
// };

// Login.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

// export { Login };

import type { NextPage } from "next";
import * as Yup from "yup";
import { useFormik } from "formik";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/components/shared";

import { Seo } from "src/components/shared/seo";
import { AuthLayout } from "src/layouts";
import { paths } from "src/constants";
import { useAuth, useRouter } from "src/hooks";
import { AuthContextType } from "src/contexts/auth";
import { LoginInitialValues } from "src/formik";

const LoginComponent: NextPage = () => {
  const router = useRouter();

  const { signIn } = useAuth<AuthContextType>();

  const formik = useFormik({
    initialValues: LoginInitialValues,
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await signIn(values);
        router.push(paths.index);
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Seo title="Login" />
      <div>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src="/images/work-dock-logo.png" alt="logo" width={50} />
          <Typography
            variant="h6"
            sx={{
              ml: 1,
              lineHeight: 1,
              fontWeight: 600,
              textTransform: "uppercase",
              fontSize: "1.5rem !important",
              fontFamily: "Poppins-SemiBold, Poppins",
            }}
          >
            Work Dock
          </Typography>
        </Box>
        <Card elevation={16}>
          <CardHeader title={<Typography variant="h5">Log in</Typography>} />
          <CardContent>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  autoFocus
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
              <Button
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                type="submit"
                variant="contained"
              >
                Log In
              </Button>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 3,
                }}
              >
                <Link href="#" underline="hover" variant="subtitle2">
                  Forgot password?
                </Link>
              </Box>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const Login: NextPage = () => {
  return <LoginComponent />;
};

Login.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export { Login };
