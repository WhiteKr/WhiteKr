import { Db, Filter, ObjectId } from 'mongodb';
import { connectDB } from '@/util/database';
import { PostType } from '@/types/postType';

interface PostProps {
  params: {
    id: string;
  };
}

const Post = async (props: PostProps) => {
  const db: Db = (await connectDB).db('choco-forum');
  const filter: Filter<PostType> = { _id: new ObjectId(props.params.id) };
  const post: PostType | null = await db.collection<PostType>('post').findOne(filter);

  return (
    <div>
      <h4>상세페이지</h4>
      <h4>{post?.title}</h4>
      <p>{post?.content}</p>
    </div>
  );
};

export default Post;
