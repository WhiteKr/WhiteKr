import { Db } from 'mongodb';
import { connectDB } from '@/util/database';
import { PostType } from '@/types/PostType';
import { PostItem } from '@/app/posts/PostItem';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import styles from './post.module.css';

export const dynamic = 'force-dynamic';

const PostsPage = async () => {
  let db: Db = (await connectDB).db('choco-forum');
  let postArray: PostType[] = await db.collection<PostType>('post').find().toArray();

  const session: Session | null = await getServerSession(authOptions);

  return (
    <div className={styles.postList}>
      {postArray.map((value: PostType, index: number) => {
          let isMine: boolean = false;
          if (session) isMine = value.email === session.user?.email;

          return <PostItem
            key={index}
            post={value}
            isMine={isMine}
          />;
        },
      )}
    </div>
  );
};

export default PostsPage;
