import { ObjectId } from 'mongodb';
import { User } from 'next-auth';

interface UserType extends User {
  _id: ObjectId,
  name: string,
  email: string,
  password: string,
}

export type { UserType };
