import * as Yup from "yup";

export const common_user_validation = {
  username: Yup.string()
    .required("Username is required")
    .min(3, "Minimum 6 Characters required"),

  full_name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Name must contain alphabetic")
    .required("Full Name is required")
    .min(3, "Minimum 3 Characters required"),

  email: Yup.string()
    .matches(/^.+@.+\..+$/, "Must be a valid email")
    .required("Email is required"),

  designation: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Designation must contain alphabetic")
    .required("Designation is required"),

  company: Yup.string().required("Company is required"),

  gender: Yup.string()
    .oneOf(["male", "female"], "Invalid gender")
    .required("Gender is required"),
};

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

export const UserAccountValidation = Yup.object({
  ...common_user_validation,
});

export const UserBankValidation = Yup.object().shape({
  bank_name: Yup.string().required("Bank name is required"),

  account_holder_name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Account holder name must contain alphabetic")
    .required("Account holder name is required")
    .min(6, "Name must be at least 3 characters"),

  account_number: Yup.string()
    .required("Account number is required")
    .matches(
      /^[0-9]{14,16}$/,
      "Account number must be between 14 and 16 digits"
    ),
});

export const employeeValidation = Yup.object().shape({
  ...common_user_validation,
  department: Yup.string().required("Department is required"),
  mobile: Yup.string()
    .required("Mobile number is required")
    .min(10, "Mobile number must be at least 15 digits")
    .max(15, "Mobile number must be no more than 17 digits"),
  national_identity_number: Yup.string()
    .required("National Identity Number is required")
    .matches(/^[0-9]+$/, "National Identity Number must contain only numbers")
    .min(13, "National Identity Number must be at least 13 digits")
    .max(15, "National Identity Number must be no more than 15 digits"),
});
