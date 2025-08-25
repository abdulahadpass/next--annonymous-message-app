import { User } from "@/models/User";
import { connectDb } from "@/lib/connectDb";

export async function POST(req: Request) {
  try {
    await connectDb();

    const { username, code } = await req.json();

    if (!code) {
      return Response.json({
        success: false,
        message: "code must be required for verification",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return Response.json({ success: false, message: "user not found" });
    }

    if (code.toString() !== user.verifyCode?.toString()) {
      return Response.json({ success: false, message: "Code not corrected" });
    }
    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpiry = undefined;

    await user.save();

    return Response.json({ success: true, message: "verification successfull" });
  } catch (error) {
    console.log("Error while verification", error);
  }
}
