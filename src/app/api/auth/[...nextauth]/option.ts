import { connectDb } from "@/lib/connectDb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: { label: "Email", tyoe: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await connectDb();
        try {
          const user = await User.findOne({
            $or: [{
                email : credentials.identifier
            },
            {
                username : credentials.identifier
            }],
          });

          if(!user){
            throw new Error('user not found')
          }
          if(!user.isVerified){
            throw new Error('user is not verified')
          }

          const isCorrectedPassword = await bcrypt.compare(credentials.password, user.password)
          if(isCorrectedPassword){
            return user
          }else{
             throw new Error("please check the password");
          }

        } catch (error : any) {
            console.log(error);
            throw new Error(error)
        }
      },
    }),
  ],
  pages : {
    signIn : '/sign-in'
  },
  session : {
    strategy : 'jwt'
  },
  secret : process.env.NEXT_AUTH_SECRET_KEY,
  callbacks: {
  async jwt({ token, user }) {
    if(user){
        token._id = user._id?.toString()
        token.isVerified = user.isVerified
        token.email = user.email
        token.isAcceptingMessages = user.isAcceptingMessages
    }
   return token
  },
  async session({ session, token }) {
    if(token){
        session.user._id = token._id?.toString()
        session.user.isVerified = token.isVerified
        session.user.username = token.username
        session.user.isAcceptingMessages = token.isAcceptingMessages
    }
    return session
  }
}
};
