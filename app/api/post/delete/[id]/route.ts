import { NextRequest, NextResponse } from 'next/server';
import { Db, DeleteResult, ObjectId } from 'mongodb';
import { connectDB } from '@/util/database';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PostType } from '@/types/postType';

interface PostDeleteParams {
  params: {
    id: string;
  };
}

export const DELETE = async (
  _request: NextRequest,
  { params }: PostDeleteParams,
) => {
  try {
    const session: Session | null = await getServerSession(authOptions);
    if (session == null) {
      return new NextResponse(
        JSON.stringify({ result: 'login first.' }),
        { status: 401 },
      );
    }
    if (params.id == null) {
      return new NextResponse(
        JSON.stringify({ result: 'postId is null' }),
        { status: 400 },
      );
    }

    const db: Db = (await connectDB).db('choco-forum');
    const post: PostType | null = await db
      .collection('post')
      .findOne<PostType>({ _id: new ObjectId(params.id) });
    if (post == null) {
      console.log(post);
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
        JSON.stringify({ result: 'failed post delete' }),
        { status: 404 },
      );
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ result: 'error post delete' }),
      { status: 500 },
    );
  }
};
