// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/util/connectToDB";
import User, { IUser } from "@/models/User.model";
import mongoose from "mongoose";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      await connectToDB();
      const sessionUser: IUser | null = await User.findOne({
        email: session.user.email,
      });

      if (sessionUser) {
        session.user.id = (
          sessionUser._id as mongoose.Types.ObjectId
        ).toString();
      }

      return session;
    },
    async signIn({ user, profile }) {
      await connectToDB();

      const userExists = await User.findOne({ email: user.email });

      if (!userExists) {
        await User.create({
          email: user.email,
          username: user.name?.replace(/\s+/g, "").toLowerCase() || "user",
          created_date: new Date(),
        });
      }

      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
