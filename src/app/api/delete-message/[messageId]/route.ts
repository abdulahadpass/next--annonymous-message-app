import { User as UserModel } from "@/models/User";
import { connectDb } from "@/lib/connectDb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { User } from "next-auth";
import { success } from "zod";
export async function DELETE(req:Request, {params} : {params : {messageid  : string}}){
    try {
        const messageId = params.messageid
        await connectDb()
        const session = await getServerSession(authOptions)
        const user : User = session?.user as User

        if(!session || !session.user){
            return
        }

        const updatedUser = await UserModel.updateOne({_id : user._id}, {
            $pull : {messages : {_id : messageId}}
        })
        if(updatedUser.modifiedCount === 0){
            return Response.json({success : false, message : 'Message already deleted or not found'})
        }
        return Response.json({success : true, message : 'Message Deleted Successfully'})
    } catch (error) {
        console.log('Error while deleting message', error);
    }
}