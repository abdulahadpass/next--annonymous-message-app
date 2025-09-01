import { User as UserModel } from "@/models/User";
import { connectDb } from "@/lib/connectDb";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
export async function POST(req: Request) {
  await connectDb();
  const { acceptMessage } = await req.json();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  const userId = user._id;
  try {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          isAcceptingMessages: acceptMessage,
        },
      },
      { new: true }
    );
    if (!user) {
      return Response.json({
        success: false,
        message: "user not found an not update the accepting message status",
      });
    }

    return Response.json({ success: true, message: "accepting message fetch" });
  } catch (error) {
    console.log("Error while Accepting message function", error);
  }
}
export async function GET(req: Request) {
  await connectDb();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json({ success: false, message: "user not found" });
    }
    return Response.json({success : true, isAcceptingMessages : foundUser.isAcceptingMessages})
  } catch (error) {
    console.log("Error while get the accept message status", error);
  }
}
