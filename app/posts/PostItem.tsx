'use client';

import Link from 'next/link';
import { PostType } from '@/types/PostType';
import React from 'react';

interface PostItemProps {
  value: PostType;
  isMine: boolean;
}

export const PostItem = (props: PostItemProps) => {
  const {
    value,
    isMine = false,
  }: PostItemProps = props;

  const onClickDelete = async (event: React.MouseEvent<HTMLSpanElement>) => {
    try {
      const item: HTMLSpanElement = (event.target as HTMLSpanElement).parentElement!;

      const result: Response = await fetch(
        `/api/post/delete/${value._id.toString()}`,
        { method: 'DELETE' },
      );
      if (!result.ok) return;

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

    {isMine && <Link href={`/post/edit/${value._id}`}>✏️</Link>}
    {isMine && <span onClick={onClickDelete}>🗑️</span>}

    <p>{value.content}</p>
  </div>;
};
