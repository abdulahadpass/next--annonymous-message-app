import { z } from "zod";

export const signinSchema = z.object({
  identifier: z
    .string()
    .min(3, "username must be at least 3 character")
    .max(30, "username should be maximun 30 character"),

  password: z.string(),
});
