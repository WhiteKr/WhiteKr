import { NextRequest, NextResponse } from 'next/server';
import { Db, DeleteResult, InsertOneResult, ObjectId } from 'mongodb';
import { connectDB } from '@/util/database';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PostType } from '@/types/PostType';

// export const GET = async (request: NextRequest) => {
//   try {
//     const searchParams: URLSearchParams = request.nextUrl.searchParams;
//     const id: string | null = searchParams.get('id');
//   } catch (error) {
//     return new Response(
//       JSON.stringify({ msg: 'GET posts error' }),
//       { status: 500 },
//     );
//   }
// };

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
    const result: InsertOneResult = await db
      .collection<PostType>('post')
      .insertOne({
        email: session!.user?.email,
        title: title,
        content: content,
        timestamp: new Date(),
      } as PostType);

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

export const DELETE = async (request: NextRequest) => {
  try {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const id: string | null = searchParams.get('id');
    if (id == null) {
      return new NextResponse(
        JSON.stringify({ result: 'postId is required' }),
        { status: 400 },
      );
    }

    const session: Session | null = await getServerSession(authOptions);
    if (session == null) {
      return new NextResponse(
        JSON.stringify({ result: 'login first.' }),
        { status: 401 },
      );
    }

    const db: Db = (await connectDB).db('choco-forum');
    const post: PostType | null = await db
      .collection('post')
      .findOne<PostType>({ _id: new ObjectId(id) });
    if (post == null) {
      return new NextResponse(
        JSON.stringify({ result: 'post is not found.' }),
        { status: 404 },
      );
    }
    if (post.email != session!.user?.email) {
      return new NextResponse(
        JSON.stringify({ result: 'post is not yours.' }),
        { status: 401 },
      );
    }

    const result: DeleteResult = await db.collection('post').deleteOne(post);
    if (result.deletedCount == 1) {
      return new NextResponse(
        JSON.stringify({ result: 'post deleted' }),
        { status: 200 },
      );
    } else {
      return new NextResponse(
        JSON.stringify({ result: 'failed post edit' }),
        { status: 404 },
      );
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ result: 'error post edit' }),
      { status: 500 },
    );
  }
};
