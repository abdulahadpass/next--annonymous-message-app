import { z } from "zod";

export const isAcceptingMessagesSchema = z.object({
  acceptMessages: z.boolean(),
});
