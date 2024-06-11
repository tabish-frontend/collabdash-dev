import * as Yup from "yup";

export const LoginValidation = Yup.object({
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  password: Yup.string()
    .max(255)
    .required("Password is required")
    .min(8, "Password must have at least 8 characters"),
});

export const ResetPasswordValidation = Yup.object({
  password: Yup.string()
    .required("New Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase(A-Z), One Lowercase(a-z), One Number(0-9) and special case Character(e.g. !@#$%^&*)"
    ),
  password_confirm: Yup.string()
    .required("Please re-type your password")
    .oneOf([Yup.ref("password")], "Passwords does not match"),
});
