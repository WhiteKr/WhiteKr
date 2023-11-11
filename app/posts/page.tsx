import { Db } from 'mongodb';
import { connectDB } from '@/util/database';
import { PostType } from '@/types/postType';
import { PostItem } from '@/app/posts/PostItem';

export const dynamic = 'force-dynamic';

const PostsPage = async () => {
  let db: Db = (await connectDB).db('choco-forum');
  let postArray: PostType[] = await db.collection<PostType>('post').find().toArray();

  return (
    <div className='list-bg'>
      {postArray.map((value: PostType, index: number) =>
        <PostItem key={index} value={value} />,
      )}
    </div>
  );
};

export default PostsPage;
