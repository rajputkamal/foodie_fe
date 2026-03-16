import * as Yup from "yup";

export const menuItemSchema = Yup.object({
  categoryId: Yup.string().required("Please select a category"),
  name: Yup.string().min(2, "Too short").required("Item name is required"),
  description: Yup.string().optional(),
  price: Yup.number()
    .typeError("Must be a number")
    .min(1, "Price must be > 0")
    .required("Price is required"),
  vegType: Yup.string().oneOf(["veg", "nonveg"]).required("Please select type"),
});

export const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Too short")
    .required("Restaurant name is required"),
  address: Yup.string()
    .min(10, "Please enter a full address")
    .required("Address is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .max(10, "Please enter a valid 10 digit number")
    .matches(/^[+]?[\d\s\-()]{7,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  vegType: Yup.string()
    .oneOf(["veg", "nonveg", "both"])
    .required("Please select a menu type"),
  logoFile: Yup.mixed().nullable().optional(),
});
