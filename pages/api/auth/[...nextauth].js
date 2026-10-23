import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import clientPromise from "./lib/mongodb";
import db from "../../../utils/db";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await db.connectDb();
          if (!credentials.email || !credentials.password) {
            throw new Error("Email and password are required.");
          }
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("This email does not exist.");
          }
          if (!user.password) {
            throw new Error("Please enter your password");
          }
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            throw new Error("Email hoặc mật khẩu không đúng");
          }
          return user;
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error(error.message || "Internal server error.");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user._id?.toString() || user.id;
      }
      return token;
    },
    async session({ session, token }) {
      try {
        // Chỉ tìm user nếu có token và token.sub hợp lệ (user đã đăng nhập)
        if (!token || !token.sub) {
          return session;
        }
        await db.connectDb();
        const user = await User.findById(token.sub);
        if (!user) {
          return session;
        }
        session.user.id = token.sub || user._id.toString();
        session.user.name = user.name;
        session.user.role = user.role || "user";
        session.user.emailVerified = user.emailVerified || false;
        session.user.image = user.image;
        session.user.gender = user.gender;
        session.user.dateOfBirth = user.dateOfBirth;
        session.user.phone = user.phone;
        session.user.defaultShippingAddress = user.defaultShippingAddress;
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },
  pages: {
    signIn: "/dang-nhap",
    error: "/loi-dang-nhap",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
};

export default NextAuth(authOptions);
