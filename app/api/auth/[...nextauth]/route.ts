import NextAuth, { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { connectDB } from '@/util/database';
import { Db } from 'mongodb';
import bcrypt from 'bcryptjs';
import { UserType } from '@/types/UserType';

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GH_CLIENT_ID!,
      clientSecret: process.env.GH_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text', placeholder: 'iamreally@dumb.com' },
        password: { label: 'password', type: 'password', placeholder: 'qwer1234!@#$' },
      },

      authorize: async (credentials, _req) => {
        const db: Db = (await connectDB).db('choco-forum');
        const user: UserType | null = await db
          .collection('user_cred')
          .findOne<UserType>({ email: credentials!.email });
        if (!user) {
          console.log('email not found.');
          return null;
        }

        const pwCheck: boolean = await bcrypt.compare(credentials!.password, user.password);
        if (!pwCheck) {
          console.log('wrong password.');
          return null;
        }

        return user;
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.user = {};
        token.user.name = user.name;
        token.user.email = user.email;
      }
      return token;
    },
    //5. 유저 세션이 조회될 때 마다 실행되는 코드
    session: async ({ session, token }: any) => {
      session.user = token.user;
      return session;
    },
  },

  adapter: MongoDBAdapter(connectDB),
  secret: process.env.JWT_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
