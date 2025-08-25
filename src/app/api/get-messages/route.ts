import { User as Model } from "@/models/User";
import { connectDb } from "@/lib/connectDb";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";
export async function GET(req: Request) {
  await connectDb();
  const session = await getServerSession();
  const user: User = session?.user as User;

  if (!session || session.user) {
    return Response.json({
      success: false,
      message: "Session in not authenticated",
    });
  }
  const userId = user._id;
  try {
    const getMessages = await Model.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$message" },
      { $sort: { "$message.createdAt": -1 } },
      { $group: { _id: "$_id", message: { $push: "$message" } } },
    ]);
    if(!getMessages || getMessages.length === 0){
         return Response.json({
      success: false,
      message: "no messages",
    });
    }
     return Response.json({
      success: true,
      message: "Get User messages successfully",
    });
  } catch (error) {
    console.log("Error while get messages", error);
  }
}
