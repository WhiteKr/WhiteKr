import { NextRequest, NextResponse } from 'next/server';
import { Db, ObjectId } from 'mongodb';
import { connectDB } from '@/util/database';

export const POST = async (request: NextRequest) => {
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

  try {
    const db: Db = (await connectDB).db('choco-forum');
    await db.collection('post')
      .updateOne({ _id: _id }, {
          $set: {
            title: title,
            content: content,
          },
        },
      );

    return NextResponse.redirect(
      new URL(`/post/${_id}`, request.url),
      { status: 301 },
    );
  } catch (error) {
    console.log(error);

    return new NextResponse(
      JSON.stringify({ msg: `Edit post(${_id}) failed.` }),
      { status: 500 },
    );
  }
};