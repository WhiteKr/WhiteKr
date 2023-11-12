import { ObjectId } from 'mongodb';

interface UserType {
  _id: ObjectId;
  name: string;
  email: string;
  image: string;
  emailVerified: boolean;
  password: string;
}

export type { UserType };
