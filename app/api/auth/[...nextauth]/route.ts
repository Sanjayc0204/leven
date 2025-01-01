import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/util/connectToDB";
import User, { IUser } from "@/models/User.model";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session, DefaultUser } from "next-auth";

interface GoogleProfile {
  picture?: string;
  email?: string;
  name?: string;
}

// Function to set trusted headers (for reverse proxies/load balancers)
const trustHeaders = (req: NextApiRequest) => {
  req.headers["x-forwarded-proto"] = "https";
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Apply trusted headers in production
  if (process.env.NODE_ENV === "production") {
    trustHeaders(req);
  }

  // Debugging logs
  console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
  console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
  console.log("Incoming headers:", req.headers);

  return NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session }: { session: Session }) {
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
      async signIn({ user, profile }: { user: DefaultUser; profile?: GoogleProfile }) {
        await connectToDB();

        const userExists = await User.findOne({ email: user.email });

        if (!userExists) {
          let username = user.name
            ? user.name.replace(/\s+/g, "").toLowerCase()
            : "default-username";

          if (username.length < 8) {
            username += Math.random().toString(36).substring(2, 10);
          }
          username = username.substring(0, 20).replace(/[^a-zA-Z0-9]/g, "");

          const googleProfile = profile as GoogleProfile;

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
          const googleProfile = profile as GoogleProfile;

          if (
            googleProfile.picture &&
            userExists.image !== googleProfile.picture
          ) {
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
};

export { handler as GET, handler as POST };
