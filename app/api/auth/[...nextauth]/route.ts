import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/util/connectToDB";
import User, { IUser } from "@/models/User.model";
import mongoose from "mongoose";

// Function to trust headers in production
const trustHeaders = (req: NextRequest) => {
  req.headers.set("x-forwarded-proto", "https");
};

// Export the runtime configuration
export const runtime = "edge";

// Handler function
export async function handler(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    trustHeaders(req);
  }

  console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
  console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
  console.log("Incoming headers:", req.headers);

  return NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
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
          const username = (user.name || "default-username")
            .replace(/\s+/g, "")
            .toLowerCase()
            .substring(0, 20)
            .replace(/[^a-zA-Z0-9]/g, "");
          const googleProfile = profile as { picture?: string };
          await User.create({
            email: user.email,
            username,
            image: googleProfile.picture,
            communities: [],
            settings: {
              theme: "light",
              notifications: true,
            },
            last_login_date: new Date(),
            created_date: new Date(),
          });
        } else {
          const googleProfile = profile as { picture?: string };
          if (googleProfile.picture && userExists.image !== googleProfile.picture) {
            userExists.image = googleProfile.picture;
          }
          userExists.last_login_date = new Date();
          await userExists.save();
        }
        return true;
      },
    },
    pages: {
      error: "/auth/error",
    },
    logger: {
      error(code, metadata) {
        console.error("NextAuth Error:", code, metadata);
      },
      warn(message) {
        console.warn("NextAuth Warning:", message);
      },
      debug(message) {
        console.debug("NextAuth Debug:", message);
      },
    },
    debug: true,
  });
}

export { handler as GET, handler as POST };
