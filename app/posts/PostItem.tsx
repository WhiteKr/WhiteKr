'use client';

import Link from 'next/link';

interface PostItemProps {
  value: any;
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
      <p>
        {value.content}
      </p>
    </div>
  );
};
