import { Db, DeleteResult, InsertOneResult, ObjectId } from 'mongodb';
import { connectDB } from '@/util/database';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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

export const POST = async (request: Request) => {
  try {
    const session: Session | null = await getServerSession(authOptions);
    const comment: CommentType = await request.json();
    if (!comment.content.trim()) {
      return new Response(
        JSON.stringify({
          message: 'empty comment content',
        }), { status: 400 },
      );
    }

    const db: Db = (await connectDB).db('choco-forum');
    const result: InsertOneResult<CommentType> = await db
      .collection<CommentType>('comment')
      .insertOne({
        content: comment.content,
        parentId: new ObjectId(comment.parentId),
        email: session?.user!.email,
        timestamp: new Date(),
      } as CommentType);
    if (!result.insertedId) {
      return new Response(
        JSON.stringify({
          message: 'failed to post new comment',
        }), { status: 500 },
      );
    }

    const newComment: CommentType | null = await db
      .collection<CommentType>('comment')
      .findOne({ _id: result.insertedId });
    if (!newComment) {
      return Response.redirect(request.url, 302);
    }

    return new Response(
      JSON.stringify(newComment),
      { status: 200 },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        message: 'error on post new comment',
      }), { status: 500 },
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const searchParams: URLSearchParams = request.nextUrl.searchParams;
    const id: string | null = searchParams.get('id');
    if (!id) {
      return new Response(
        JSON.stringify({
          message: 'id is required',
        }), { status: 400 },
      );
    }

    const db: Db = (await connectDB).db('choco-forum');
    const result: DeleteResult = await db
      .collection<CommentType>('comment')
      .deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) {
      return new Response(
        JSON.stringify({
          message: 'failed to edit comment',
        }), { status: 500 },
      );
    }

    return new Response(
      JSON.stringify({
        message: 'successfully deleted comment',
      }), { status: 200 },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'error on edit comment',
      }), { status: 500 },
    );
  }
};
