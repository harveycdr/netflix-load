import NextAuth, { AuthOptions } from "next-auth";
import Credentials from 'next-auth/providers/credentials';
import {compare} from 'bcrypt';
import prismadb from '@/lib/prismadb'
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Mật khẩu',
          type: 'password',
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password){
          throw new Error('Yêu cầu email và mật khẩu');
        }

        const user = await prismadb.user.findUnique({
          where: {
            email: credentials.email
          }
        });
        
        if (!user || !user.hashedPassword) {
          throw new Error('Email không tồn tại');
        }

        const inCorrectPassword = await compare(
          credentials.password,
          user.hashedPassword
        );

        if (!inCorrectPassword) {
          throw new Error('Mật khẩu không chính xác!');
        }
        return user;
      }
    })
  ],
  pages: {
    signIn: '/auth',
  },
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prismadb),
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);