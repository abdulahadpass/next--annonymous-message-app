import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "username must be at least 3 characters")
  .max(20, "no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/);

export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z.string().min(6, "password must be at least 6 characters"),
});
