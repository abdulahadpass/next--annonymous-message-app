import { z } from "zod";

export const isAcceptingMessagesSchema = z.object({
  acceptMessage: z.boolean(),
});
