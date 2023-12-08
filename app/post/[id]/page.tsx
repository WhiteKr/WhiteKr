import CommentSection from '@/app/post/[id]/CommentSection';
import ProfileAvatar from '@/components/ProfileAvatar';
import { PostType } from '@/types/PostType';
import { UserType } from '@/types/UserType';
import { connectDB } from '@/util/database';
import { Db, Filter, ObjectId } from 'mongodb';
import styles from '../post.module.css';
import { TimeAgo } from './TimeAgo';

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
    <div className={`page-container ${styles.postContainer}`}>
      <div className={styles.postHeader}>
        <p>{post?.title}</p>
        <div className={styles.infoContainer}>
          <p>{author?.name}</p>
          <ProfileAvatar src={author?.image} size={40} />
        </div>
      </div>
      <div className={styles.postContent}>
        <p>{post?.content}</p>
      </div>
      <div className={`${styles.timestamps} ${styles.infoContainer}`}>
        <TimeAgo
          suffix='작성'
          timestamp={post?.timestamp}
        />
        <TimeAgo
          suffix='수정'
          timestamp={post?.updatedAt}
        />
      </div>
      <CommentSection parentId={post!._id.toString()} />
    </div>
  );
};

export default PostPage;
