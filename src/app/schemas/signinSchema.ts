import { z } from "zod";

export const signinSchema = z.object({
  username: z
    .string()
    .min(3, "username must be at least 3 character")
    .max(20, "username should be maximun 20 character"),

  password: z.string(),
});
