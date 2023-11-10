import { Db } from 'mongodb';
import { connectDB } from '@/util/database';

const Post = async () => {
  let db: Db = (await connectDB).db('choco-forum');
  let postArray = await db.collection('post').find().toArray();

  return (
    <div className='list-bg'>
      {postArray.map((value, index: number) =>
        <div className='list-item' key={index}>
          <h4>{value.title}</h4>
          <p>{value.content}</p>
        </div>,
      )}
    </div>
  );
};

export default Post;