'use client';

import Link from 'next/link';
import { PostType } from '@/types/postType';
import React from 'react';

interface PostItemProps {
  value: PostType;
}

export const PostItem = (props: PostItemProps) => {
  const { value }: PostItemProps = props;

  const onClickDelete = async (event: React.MouseEvent<HTMLSpanElement>) => {
    try {
      const item: HTMLSpanElement = (event.target as HTMLSpanElement).parentElement!;

      const result: Response = await fetch(
        `/api/post/delete/${value._id.toString()}`,
        { method: 'DELETE' },
      );
      if (!result.ok) {
        console.log(result);
        return;
      }

      item.style.opacity = '0';
      setTimeout(() => {
        item.style.display = 'none';
      }, 1000);

    } catch (error) {
      console.log(error);
    }
  };

  return <div className='list-item'>
    <Link
      prefetch={false}
      href={`/post/${value._id}`}
    >
      <h4>{value.title}</h4>
    </Link>

    <Link href={`/post/edit/${value._id}`}>✏️</Link>
    {true && <span onClick={onClickDelete}>🗑️</span>}

    <p>{value.content}</p>
  </div>;
};
