import * as yup from "yup";
import { date, object } from "yup";
import { parse, isDate } from "date-fns";

const today = new Date();

function parseDateString(value, originalValue) {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, "yyyy-MM-dd", new Date());

  return parsedDate;
}

export const scheduleClassValidationSchema = yup.object({
  location: yup.string().required("Required"),
  fitnessClass: yup.string().required("Required"),
  maxSpots: yup.number().required("Required"),
  // date: date().transform(parseDateString).min(today).required("Required"),
  date: yup.date().required("Required"),
});
