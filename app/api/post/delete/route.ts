import { NextRequest, NextResponse } from 'next/server';
import { Db, ObjectId } from 'mongodb';
import { connectDB } from '@/util/database';

export const DELETE = async (request: NextRequest) => {
  const postId: string | null = new URL(request.url).searchParams.get('postId');

  if (postId == null) {
    return new NextResponse(JSON.stringify({ result: 'postId is null' }), { status: 400 });
  }

  try {
    const db: Db = (await connectDB).db('choco-forum');
    await db.collection('post')
      .deleteOne({
        _id: new ObjectId(postId),
      });

    return new NextResponse(JSON.stringify({ result: 'post deleted' }), { status: 200 });

  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ result: 'error on post delete' }),
      { status: 500 },
    );
  }
};
