import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import styles from '@/app/post/post.module.css';

const PostWritePage = async () => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    return <div className={'page-container'}>로그인이 필요합니다.</div>;
  }

  return (
    <div className={'page-container'}>
      <form
        action='/api/post/new'
        method='POST'
        className={styles.postForm}
      >
        <input name='title' placeholder='제목' />
        <textarea name='content' placeholder='내용' rows={10} />
        <button type='submit'>버튼</button>
      </form>
    </div>
  );
};

export default PostWritePage;
