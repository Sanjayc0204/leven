import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from '@/util/connectToDB';
import User, { IUser } from '@/models/User.model';
import mongoose from 'mongoose';

// Extend the NextAuth Profile to include the Google 'picture' field
interface GoogleProfile extends Record<string, any> {
  picture?: string;
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session }) {
      await connectToDB();

      const sessionUser: IUser | null = await User.findOne({ email: session.user.email });
      if (sessionUser) {
        session.user.id = (sessionUser._id as mongoose.Types.ObjectId).toString(); // Add MongoDB ID to session
      }

      return session;
    },
    async signIn({ user, profile }) {
      await connectToDB();

      const userExists = await User.findOne({ email: user.email });

      if (!userExists) {
        // Handle case where user.name is null or undefined, use fallback
        const username = user.name ? user.name.replace(/\s+/g, '').toLowerCase() : 'default-username';

        // Profile is cast as GoogleProfile to ensure 'picture' is handled correctly
        const googleProfile = profile as GoogleProfile;

        // If user doesn't exist, create a new user in the database
        await User.create({
          email: user.email,
          username,
          image: googleProfile.picture, // Handle the Google profile picture
          communities: [],
          settings: {
            theme: 'light',
            notifications: true,
          },
          last_login_date: new Date(),
          created_date: new Date(),
        });
      } else {
        // If user exists, update profile picture and last login date
        const googleProfile = profile as GoogleProfile;

        if (googleProfile.picture && userExists.image !== googleProfile.picture) {
          userExists.image = googleProfile.picture;
        }

        userExists.last_login_date = new Date();
        await userExists.save();
      }

      return true;
    },
  },
});

export { handler as GET, handler as POST };
