import { Db, Filter, ObjectId } from 'mongodb';
import { connectDB } from '@/util/database';
import { PostType } from '@/types/postType';

interface PostEditProps {
  params: {
    id: string;
  };
}

const PostEditPage = async (props: PostEditProps) => {
  const db: Db = (await connectDB).db('choco-forum');
  const filter: Filter<PostType> = { _id: new ObjectId(props.params.id) };
  const post: PostType | null = await db.collection<PostType>('post').findOne(filter);

  return (
    <div>
      <h4>글수정</h4>
      <form action={`/api/post/edit`} method='POST'>
        <input name='title' placeholder='제목' defaultValue={post?.title} />
        <input name='content' placeholder='내용' defaultValue={post?.content} />
        <input name='_id' type='hidden' defaultValue={post?._id.toString()} />
        <button type='submit'>수정</button>
      </form>
    </div>
  );
};

export default PostEditPage;
