import { Db, DeleteResult, InsertOneResult, ObjectId } from 'mongodb';
import { connectDB } from '@/util/database';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CommentType } from '@/types/PostCommentType';

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

export const DELETE = async () => {
  try {
    const db: Db = (await connectDB).db('choco-forum');
    const result: DeleteResult = await db
      .collection('comment')
      .deleteOne({});
    if (!result.deletedCount) {
      return new Response(
        JSON.stringify({
          message: 'failed to delete comment',
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
        message: 'error on delete comment',
      }), { status: 500 },
    );
  }
};
