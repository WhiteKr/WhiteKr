import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Db, InsertOneResult } from 'mongodb';
import { connectDB } from '@/util/database';

export const POST = async (request: NextRequest) => {
  try {
    const session: Session | null = await getServerSession(authOptions);
    if (session == null) {
      return new NextResponse(
        JSON.stringify({ msg: 'Please login first.' }),
        { status: 401 },
      );
    }

    const formData: FormData = await request.formData();

    const title: string = formData.get('title') as string;
    const content: string = formData.get('content') as string;
    if (title == '') {
      return new NextResponse(
        JSON.stringify({ msg: 'No title provided.' }),
        { status: 400 },
      );
    }
    if (content == '') {
      return new NextResponse(
        JSON.stringify({ msg: 'No content provided.' }),
        { status: 400 },
      );
    }

    const db: Db = (await connectDB).db('choco-forum');
    const result: InsertOneResult<Document> = await db
      .collection('post')
      .insertOne({
        email: session!.user?.email,
        title: title,
        content: content,
      });

    return NextResponse.redirect(
      new URL(`/post/${result.insertedId.toString()}`, process.env.NEXTAUTH_URL),
      { status: 301 },
    );
  } catch (error) {
    console.log(error);

    return new NextResponse(
      JSON.stringify({ msg: 'Add new post failed.' }),
      { status: 500 },
    );
  }
};
