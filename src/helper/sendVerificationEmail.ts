import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/utils/ApiResponse";


export const sendVerificationEmail = async (
  username: string,
  email: string,
  verifyCode: string): Promise<ApiResponse> => {
    console.log(email);
    
  try {
     await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Message Verification Code",
     html : `Hello user <b>${username}</b> your verification code is <b>${verifyCode}</b>`
    });
    
    return {success : true, message : 'Email send successfully'}
} catch (error) {
    console.log("Error while send the email", error);
    return {success : false, message : 'Email unsend'}
  }
};
