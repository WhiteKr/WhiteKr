import { CommentType } from '@/types/PostCommentType';
import React, { useEffect, useState } from 'react';
import styles from '@/app/post/comment.module.css';
import { UserType } from '@/types/UserType';
import ProfileAvatar from '@/components/ProfileAvatar';
import { timeAgo } from '@/util/date';

interface CommentItemProps {
  comment: CommentType;
  removeComment: (comment: CommentType) => void;
}

const CommentItem = (props: CommentItemProps) => {
  const {
    comment,
    removeComment,
  }: CommentItemProps = props;

  const [author, setAuthor] = useState<UserType>();

  useEffect(() => {
    fetch(
      `/api/auth/user?email=${comment.email}`,
      { method: 'GET' },
    ).then(async (response: Response) => {
      return await response.json();
    }).then((user: UserType) => {
      setAuthor(user);
    });
  }, [comment.email]);

  // const onClickEdit = () => {
  // };
  const onClickDelete = () => {
    if (!confirm('댓글을 정말 삭제할까요?\n삭제하면 되돌릴 수 없습니다.')) return;

    fetch(
      `/api/post/comment?id=${comment._id}`,
      { method: 'DELETE' },
    ).then((response: Response) => {
      if (!response.ok) return;
      removeComment(comment);
    });
  };

  return (
    <div className={styles.comment}>
      <ProfileAvatar src={author?.image} size={25} />
      <div className={styles.content}>
        <div className={styles.authorContainer}>
          <b>{author?.name ?? 'Unknown'}</b>
          <p>{timeAgo(comment.timestamp)}</p>
        </div>
        <p>{comment.content}</p>
      </div>
      <div className={styles.actions}>
        {/*<span onClick={onClickEdit}>수정</span>*/}
        <span onClick={onClickDelete}>삭제</span>
      </div>
    </div>
  );
};

export default CommentItem;
