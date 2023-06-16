import * as yup from "yup";

export const userRegisterValidationSchema = yup.object().shape({
  firstName: yup.string().max(24, "First name too long").required("Required"),
  lastName: yup.string().max(24, "Last name too long").required("Required"),
  email: yup.string().email("Please enter a valid email").required("Required"),
  password: yup
    .string()
    .min(6, "Password must have at least 6 characters")
    .max(24, "Password too long")
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});
