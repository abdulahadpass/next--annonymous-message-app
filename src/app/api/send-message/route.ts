import { Message, User } from "@/models/User";
import { connectDb } from "@/lib/connectDb";

export async function POST(req: Request) {
  try {
    await connectDb();
    const { username, content } = await req.json();
    if (!content) {
      return Response.json({
        success: false,
        message: "if u want to send a messsage fill input",
      });
    }
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      return Response.json({
        success: false,
        message: "user not found",
      });
    }
    if (!foundUser.isAcceptingMessages) {
      return Response.json({
        success: false,
        message: "user not Accept messages",
      });
    }
    const newMessage = { content, createdAt: new Date() };

    foundUser.message.push(newMessage as Message);

    await foundUser.save();
    return Response.json({
      success: true,
      message: "Message send",
    });
  } catch (error) {
    console.log("Error while send message", error);
  }
}
