'use client';

import Link from 'next/link';
import { PostType } from '@/types/PostType';
import React from 'react';
import styles from './posts.module.css';
import ProfileAvatar from '@/components/ProfileAvatar';
import { UserType } from '@/types/UserType';

interface PostItemProps {
  post: PostType;
  author: UserType;
  isMine: boolean;
}

export const PostItem = (props: PostItemProps) => {
  const {
    post,
    author,
    isMine = false,
  }: PostItemProps = props;

  const onClickEdit = (event: React.MouseEvent) => {
    event.preventDefault();
    window.location.assign(`/post/edit/${post._id}`);
  };

  const onClickDelete = async (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();

    if (!confirm('포스트를 정말 삭제할까요?\n삭제하면 되돌릴 수 없습니다.')) return;

    try {
      const postContainer: HTMLSpanElement = (event.target as HTMLSpanElement)
        .parentElement!
        .parentElement!
        .parentElement!;

      const result: Response = await fetch(
        `/api/post/delete/${post._id.toString()}`,
        { method: 'DELETE' },
      );
      if (!result.ok) return;

      postContainer.style.transition = 'all 1s ease-in-out';
      postContainer.style.transform = 'scale(0.9)';
      postContainer.style.transformOrigin = 'center';
      postContainer.style.opacity = '0';
      setTimeout(() => {
        postContainer.style.display = 'none';
      }, 1000);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.postContainer}>
      <Link
        className={styles.post}
        href={`/post/${post._id}`}
        prefetch={false}
      >
        <div className={styles.postContent}>
          <h4>{post.title}</h4>
          <div className={styles.authorContainer}>
            <ProfileAvatar src={author.image} size={20} />
            <p>{author.name}</p>
          </div>
        </div>
        <div className={styles.actions}>
          {isMine && <span onClick={onClickEdit}>수정</span>}
          {isMine && <span onClick={onClickDelete}>삭제</span>}
        </div>
      </Link>
    </div>
  );
};
