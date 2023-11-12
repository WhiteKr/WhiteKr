import { Db, ObjectId } from 'mongodb';
import { connectDB } from '@/util/database';
import { CommentType } from '@/types/PostCommentType';
import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const idString: string | null = searchParams.get('id');
    if (!idString) {
      return new Response(
        JSON.stringify({
          message: 'id is required',
        }), { status: 400 },
      );
    }

    const id: ObjectId = new ObjectId(idString);

    const db: Db = (await connectDB).db('choco-forum');
    const commentList: CommentType[] | null = await db
      .collection<CommentType>('comment')
      .find({ parentId: id })
      .toArray();

    if (!commentList) {
      return new Response(
        JSON.stringify({
          message: 'error on read comment list',
        }), { status: 500 },
      );
    }

    return new Response(
      JSON.stringify(commentList),
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        message: 'error on read comment list',
      }), {
        status: 500,
      },
    );
  }
};
