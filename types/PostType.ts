import { ObjectId } from 'mongodb';

interface PostType {
  _id: ObjectId;
  email: string;
  title: string;
  content: string;
  timestamp: Date;
  updatedAt: Date;
}

export type { PostType };
