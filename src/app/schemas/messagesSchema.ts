import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "minumum 10 character are required" })
    .max(300, { message: "300 character are maximun" }),
});
