import { Db } from 'mongodb';
import { connectDB } from '@/util/database';
import { PostType } from '@/types/postType';
import Link from 'next/link';

const Post = async () => {
  let db: Db = (await connectDB).db('choco-forum');
  let postArray: PostType[] = await db.collection<PostType>('post').find().toArray();

  return (
    <div className='list-bg'>
      {postArray.map((value: PostType, index: number) =>
        <div className='list-item' key={index}>
          <Link
            prefetch={false}
            href={`/post/${value._id}`}
          >
            <h4>{value.title}</h4>
          </Link>
          <p>{value.content}</p>
        </div>,
      )}
    </div>
  );
};

export default Post;
