import * as Yup from "yup";

export const UserSchema = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email address").required("This field is required"),
  password: Yup.string().required("This field is required")
});

export const urlSchema = Yup.string().url("Please enter a valid URL").test({
  test: (value, ctx) => {
    if (value && (!value.startsWith("https") && !value.startsWith("http"))) {
      return ctx.createError({ message: 'URL should start with "http" or "https"' });
    }
    return true;
  }
});
