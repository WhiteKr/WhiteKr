'use client';

import Link from 'next/link';
import { PostType } from '@/types/postType';

interface PostItemProps {
  value: PostType;
}

export const PostItem = (props: PostItemProps) => {
  const { value }: PostItemProps = props;

  return (
    <div className='list-item'>
      <Link
        prefetch={false}
        href={`/post/${value._id}`}
      >
        <h4>{value.title}</h4>
      </Link>
      <Link href={`/post/edit/${value._id}`}>✏️</Link>
      <span onClick={() => {
        fetch(
          `/api/post/delete?postId=${value._id}`,
          { method: 'DELETE' },
        ).then((response: Response) => {
          if (response.status == 200) {
            location.reload();
          }
        }).catch((error) => {
          console.log(error);
        });
      }}>🗑️</span>
      <p>
        {value.content}
      </p>
    </div>
  );
};
