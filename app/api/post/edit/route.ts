import { NextRequest, NextResponse } from 'next/server';
import { Db, ObjectId, UpdateResult } from 'mongodb';
import { connectDB } from '@/util/database';
import { PostType } from '@/types/PostType';

export const POST = async (request: NextRequest) => {
  try {
    const formData: FormData = await request.formData();

    const _id: ObjectId = new ObjectId(formData.get('_id') as string);
    const title: string = formData.get('title') as string;
    const content: string = formData.get('content') as string;

    if (_id == null) {
      return new NextResponse(
        JSON.stringify({ msg: 'No id provided.' }),
        { status: 400 },
      );
    }
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
    const result: UpdateResult = await db.collection<PostType>('post')
      .updateOne({ _id: _id }, {
          $set: {
            title: title,
            content: content,
            updatedAt: new Date(),
          },
        },
      );
    if (!result.modifiedCount) {
      return new NextResponse(
        JSON.stringify({ msg: 'Edit post failed.' }),
        { status: 400 },
      );
    }

    return NextResponse.redirect(
      new URL(`/post/${_id.toString()}`, process.env.NEXTAUTH_URL),
      { status: 301 },
    );
  } catch (error) {
    console.log(error);

    return new NextResponse(
      JSON.stringify({ msg: `Edit post error.` }),
      { status: 500 },
    );
  }
};
