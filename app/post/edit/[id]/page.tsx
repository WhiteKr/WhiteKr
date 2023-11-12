import { Db, Filter, ObjectId } from 'mongodb';
import { connectDB } from '@/util/database';
import { PostType } from '@/types/PostType';

import styles from '../../post.module.css';

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
    <div className={`page-container`}>
      <form
        action={`/api/post/edit`}
        method='POST'
        className={styles.form}
      >
        <input name='title' placeholder='제목' defaultValue={post?.title} />
        <textarea name='content' placeholder='내용' defaultValue={post?.content} rows={10} />
        <input name='_id' type='hidden' defaultValue={post?._id.toString()} />
        <button type='submit'>수정</button>
      </form>
    </div>
  );
};

export default PostEditPage;
