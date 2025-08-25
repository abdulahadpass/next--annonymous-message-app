import { User } from "@/models/User";
import { connectDb } from "@/lib/connectDb";
import { usernameValidation } from "@/app/schemas/signupSchema";
import { URL } from "url";
import { z } from "zod";

const usernameValidationSchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);

    const queryParams = {
      username: searchParams.get("username"),
    };

    const result = usernameValidationSchema.safeParse(queryParams);
    if (!result.success) {
      const Error = result.error.format().username?._errors || [];
      return Response.json({
        success: false,
        message:
          Error.length > 0 ? Error.join(", ") : "invalid query parameters",
      });
    }

    const { username } = result.data;
    const uniqueUsername = await User.findOne({ username, isVerified: true });
    if (uniqueUsername) {
      return Response.json({
        success: false,
        message: "Username must be unique",
      });
    }
    return Response.json({ success: true, message: "Username is unique" });
  } catch (error) {
    console.log("Error while checking username uniqness", error);
  }
}
