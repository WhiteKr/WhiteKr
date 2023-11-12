import { ObjectId } from 'mongodb';

interface UserType {
  _id: ObjectId;
  password: string;

  name: string;
  email: string;
  image: string;
  emailVerified: boolean;
}

export type { UserType };
