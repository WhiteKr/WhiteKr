'use client';

import Link from 'next/link';
import { PostType } from '@/types/PostType';
import React from 'react';
import styles from './post.module.css';

interface PostItemProps {
  post: PostType;
  isMine: boolean;
}

export const PostItem = (props: PostItemProps) => {
  const {
    post,
    isMine = false,
  }: PostItemProps = props;

  const onClickDelete = async (event: React.MouseEvent<HTMLSpanElement>) => {
    try {
      const item: HTMLSpanElement = (event.target as HTMLSpanElement).parentElement!;

      const result: Response = await fetch(
        `/api/post/delete/${post._id.toString()}`,
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

  return <div className={styles.container}>
    <Link
      className={styles.post}
      href={`/post/${post._id}`}
      prefetch={false}
    >
      <div className={styles.content}>
        <h4>{post.title}</h4>
        <div className={styles.info}>
          <p>{post.email}</p>
          <p>방금 전</p>
        </div>
      </div>

      <div className={styles.actions}>
        {isMine && <Link href={`/post/edit/${post._id}`}>수정</Link>}
        {isMine && <span onClick={onClickDelete}>삭제</span>}
      </div>
    </Link>
  </div>;
};
