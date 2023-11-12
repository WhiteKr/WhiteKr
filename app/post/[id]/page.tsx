import { Db, Filter, ObjectId } from 'mongodb';
import { connectDB } from '@/util/database';
import { PostType } from '@/types/PostType';
import styles from '../post.module.css';
import { UserType } from '@/types/UserType';
import ProfileAvatar from '@/components/ProfileAvatar';

interface PostProps {
  params: {
    id: string;
  };
}

const PostPage = async (props: PostProps) => {
  const db: Db = (await connectDB).db('choco-forum');

  const postFilter: Filter<PostType> = { _id: new ObjectId(props.params.id) };
  const post: PostType | null = await db.collection<PostType>('post').findOne(postFilter);

  const userFilter: Filter<UserType> = { email: post?.email };
  const author: UserType | null = await db.collection<UserType>('users').findOne(userFilter);

  return (
    <div className={`page-container`}>
      <div className={styles.header}>
        <p>{post?.title}</p>
        <div className={styles.info}>
          <p>{author?.name}</p>
          <ProfileAvatar src={author?.image} size={40} />
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.content}>
        <p>{post?.content}</p>
      </div>
    </div>
  );
};

export default PostPage;
