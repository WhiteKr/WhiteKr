import { ObjectId } from 'mongodb';

interface CommentType {
  _id: ObjectId;
  content: string;
  parentId: string | ObjectId;
  email: string;
  timestamp: Date;
}

export type { CommentType };
