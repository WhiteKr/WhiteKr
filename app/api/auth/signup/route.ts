import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/util/database';
import { Db, InsertOneResult } from 'mongodb';

export const POST = async (request: NextRequest) => {
  try {
    const formData: FormData = await request.formData();

    const name: string = formData.get('name') as string;
    const email: string = formData.get('email') as string;
    const password: string = formData.get('password') as string;
    if (!name) {
      return new NextResponse(
        JSON.stringify({ message: 'name is required.' }),
        { status: 400 },
      );
    }
    if (!email) {
      return new NextResponse(
        JSON.stringify({ message: 'email is required.' }),
        { status: 400 },
      );
    }
    if (!password) {
      return new NextResponse(
        JSON.stringify({ message: 'password is required.' }),
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return new NextResponse(
        JSON.stringify({ message: 'password must be at least 8 characters.' }),
        { status: 400 },
      );
    }
    if (password.length > 20) {
      return new NextResponse(
        JSON.stringify({ message: 'password must be at most 20 characters.' }),
        { status: 400 },
      );
    }
    if (!email.includes('@') || !email.includes('.')) {
      return new NextResponse(
        JSON.stringify({ message: 'invalid email.' }),
        { status: 400 },
      );
    }
    if (name.length > 20) {
      return new NextResponse(
        JSON.stringify({ message: 'name must be at most 20 characters.' }),
        { status: 400 },
      );
    }
    if (name.length < 2) {
      return new NextResponse(
        JSON.stringify({ message: 'name must be at least 2 characters.' }),
        { status: 400 },
      );
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);
    const db: Db = (await connectDB).db('choco-forum');
    const result: InsertOneResult<Document> = await db.collection('user_cred')
      .insertOne({
        name: name,
        email: email,
        password: hashedPassword,
      });

    if (!result) {
      return new NextResponse(
        JSON.stringify({ message: 'error insert user' }),
        { status: 500 },
      );
    }

    return NextResponse.redirect(
      new URL('/', request.url),
      { status: 301 },
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: 'error' }),
      { status: 500 },
    );
  }
};