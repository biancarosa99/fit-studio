import * as yup from "yup";

export const scheduleClassValidationSchema = yup.object({
  location: yup.string().required("*Required"),
  fitnessClass: yup.string().required("*Required"),
  maxSpots: yup
    .number()
    .typeError("*Required")
    .min(1, "Value must be more than or equal to 1")
    .max(50, "Value must be less than or equal to 50")
    .required("*Required"),
  date: yup
    .date()
    .typeError("The value must be a valid date ( MM/DD/YYYY hh:mm a|p )"),
});
