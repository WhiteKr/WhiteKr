import { ObjectId } from 'mongodb';

interface PostType {
  _id: ObjectId;
  title: string;
  content: string;
}

export type { PostType };
