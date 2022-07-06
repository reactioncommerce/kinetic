import * as Yup from "yup";

export const UserSchema = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email address").required("This field is required"),
  password: Yup.string().required("This field is required")
});
