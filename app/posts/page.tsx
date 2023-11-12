import { Db, Filter } from 'mongodb';
import { connectDB } from '@/util/database';
import { PostType } from '@/types/PostType';
import { PostItem } from '@/app/posts/PostItem';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import styles from './posts.module.css';
import Link from 'next/link';
import { UserType } from '@/types/UserType';

export const dynamic = 'force-dynamic';

const PostsPage = async () => {
  let db: Db = (await connectDB).db('choco-forum');
  let postArray: PostType[] = await db.collection<PostType>('post').find().toArray();

  const session: Session | null = await getServerSession(authOptions);

  return (
    <div className={`page-container ${styles.list}`}>
      <div className={styles.container}>
        {session ?
          <Link href={'/post/new'} className={styles.post}>
            게시글 작성하기
          </Link> :
          <Link href={`/api/auth/signin?callbackUrl=${process.env.NEXTAUTH_URL}/post/new`} className={styles.post}>
            <p>로그인하고 새 포스트를 작성하세요.</p>
          </Link>
        }
      </div>
      {postArray.reverse().map(async (post: PostType, index: number) => {
          let isMine: boolean = false;
          if (session) isMine = post.email === session.user?.email;

          const db: Db = (await connectDB).db('choco-forum');
          const userFilter: Filter<UserType> = { email: post.email };
          const author: UserType | null = await db.collection('users').findOne<UserType>(userFilter);
          if (!author) {
            return (
              <div className={styles.container} key={index}>
                작성자를 확인할 수 없는 포스트입니다.
              </div>
            );
          }

          return (
            <PostItem
              key={index}
              post={post}
              author={author}
              isMine={isMine}
            />
          );
        },
      )}
    </div>
  );
};

export default PostsPage;
