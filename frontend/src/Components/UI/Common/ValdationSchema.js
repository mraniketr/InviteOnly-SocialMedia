import React from "react";
import * as yup from "yup";

export const pinSchema = yup
  .string()
  .matches(
    /^[1-9][0-9]+$/,
    "pincode Must be only digits,starting with non zero"
  )
  .length(6, "pincode must be exactly 6 digits")
  .notRequired();

export const mobileSchema = yup
  .string()
  .matches(
    /^([1-9][0-9]{9}|)$/,
    "Mobile Must be 10 digits, starting with non zero"
  );
// .length(10, "Mobile number must be exactly 10 digits");
export const mobileSchemaReq = yup
  .string()
  .matches(
    /^([1-9][0-9]{9})$/,
    "Mobile Must be 10 digits, starting with non zero"
  );

export const onlyAlphabetsNA = yup
  .string()
  .matches(/^([aA-zZ\s]+|)$/, "Only alphabets are allowed");

export const onlyAlphabets = yup
  .string()
  .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed ");

export const dob = yup
  .string()
  .matches(
    /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
    "Date of Birth must be a valid date in the format YYYY-MM-DD"
  );

export const id = yup.number().positive().integer();
