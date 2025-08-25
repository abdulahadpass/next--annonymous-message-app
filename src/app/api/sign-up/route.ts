import { User } from "@/models/User";
import { connectDb } from "@/lib/connectDb";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(req: Request) {
  try {
    connectDb()
    const { username, email, password } = await req.json();

    if ([username, email, password].some((fields) => fields === "")) {
      return Response.json(
        { success: false, message: "Fields must be required" },
        { status: 400 }
      );
    }
    const existedUser = await User.findOne({
      $or: [
        {
          username,
        },
        { email },
      ],
    });
    if (existedUser) {
      return Response.json(
        { success: false, message: "user already existed" },
        { status: 400 }
      );
    }

    const userByEmail = await User.findOne({ email });
     const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString()

    if (userByEmail) {
        if(userByEmail?.isVerified){
            return Response.json({success : false, message : 'user is already exist'}, {status : 400})
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            userByEmail.password = hashedPassword
            userByEmail.isVerified = true
            userByEmail.verifyCodeExpiry = new Date(Date.now() * 3600000)

            await userByEmail.save()
        }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
       const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      
      await User.create({
        username,
        email,
        password :hashedPassword,
        isVerified : false,
        verifyCode:verificationCode,
        verifyCodeExpiry : expiryDate,
        isAcceptingMessages : false,
        message : []
     })


     // verification email

     const emailResponse = sendVerificationEmail(username, email, verificationCode)

     if (!(await emailResponse).success) {
      return Response.json(
        {
          success: false,
          message: (await emailResponse).message
        },
        { status: 500 }
      );
    }
    return Response.json({
      success : true
    }
    )
    }
  } catch (error) {
    console.log("Error while signning-up", error);
    return Response.json({success : false, message : 'Error while signning-up'})
  }
}
