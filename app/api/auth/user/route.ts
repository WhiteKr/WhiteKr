import { NextRequest } from 'next/server';
import { Db } from 'mongodb';
import { connectDB } from '@/util/database';
import { UserType } from '@/types/UserType';

export const GET = async (request: NextRequest) => {
  try {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const email: string | null = searchParams.get('email');
    if (!email) {
      return new Response(
        JSON.stringify({
          message: 'email is required',
        }), { status: 400 },
      );
    }

    const db: Db = (await connectDB).db('choco-forum');
    const user: UserType | null = await db
      .collection<UserType>('users')
      .findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({
          message: 'user not found',
        }), { status: 404 },
      );
    }

    return new Response(
      JSON.stringify(user),
      { status: 200 },
    );

  } catch (e) {
    return new Response(
      JSON.stringify({
        message: 'error on get user',
      }), { status: 500 },
    );
  }
};