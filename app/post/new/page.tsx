import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const PostWritePage = async () => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div>
      <h4>글작성</h4>
      <form action='/api/post/new' method='POST'>
        <input name='title' placeholder='제목' />
        <input name='content' placeholder='내용' />
        <button type='submit'>버튼</button>
      </form>
    </div>
  );
};

export default PostWritePage;
