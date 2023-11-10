import { NextRequest, NextResponse } from 'next/server';
import { Db, InsertOneResult } from 'mongodb';
import { connectDB } from '@/util/database';

export async function POST(request: NextRequest) {
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

  try {
    const db: Db = (await connectDB).db('choco-forum');
    const result: InsertOneResult<Document> = await db
      .collection('post')
      .insertOne({ title: title, content: content });

    return NextResponse.redirect(
      new URL(`/post/${result.insertedId.toString()}`, request.url),
      { status: 301 });
  } catch (error) {
    console.log(error);

    return new NextResponse(
      JSON.stringify({ msg: 'Add new post failed.' }),
      { status: 500 },
    );
  }
}
