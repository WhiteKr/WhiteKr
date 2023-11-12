'use client';

import React, { useEffect, useState } from 'react';
import { CommentType } from '@/types/PostCommentType';
import CommentItem from '@/app/post/[id]/CommentItem';
import styles from '@/app/post/comment.module.css';

interface CommentSectionProps {
  parentId: string;
}

const CommentSection = (props: CommentSectionProps) => {
  const { parentId }: CommentSectionProps = props;

  const [comment, setComment] = useState<string>('');
  const [commentList, setCommentList] = useState<CommentType[]>([]);

  useEffect(() => {
    fetch(
      `/api/post/comment/list?id=${parentId}`,
      { method: 'GET' },
    ).then((response: Response) => {
      return response.json();
    }).then((value: CommentType[]) => {
      setCommentList(value);
      return;
    });
  }, [parentId]);

  const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => setComment(event.target.value);
  const onClickSubmit = async () => {
    if (!comment.trim()) return;

    const result: Response = await fetch(
      '/api/post/comment',
      {
        method: 'POST',
        body: JSON.stringify({
          content: comment,
          parentId: parentId,
        } as CommentType),
      },
    );
    if (!result.ok) return;

    setComment('');
    setCommentList(
      [...commentList, await result.json() as CommentType],
    );
    return;
  };

  const removeComment = (comment: CommentType) => {
    setCommentList(
      commentList.filter((cmt: CommentType) => cmt._id !== comment._id),
    );
  };

  return (
    <div className={styles.commentList}>
      <h4>COMMENTS</h4>
      {commentList.length > 0 ?
        commentList.map((cmt: CommentType, index: number) => (
          <CommentItem
            comment={cmt}
            removeComment={removeComment}
            key={index}
          />
        )) :
        <div>코멘트가 없습니다.</div>
      }
      <div className={styles.commentForm}>
        <input value={comment} onChange={onCommentChange} />
        <button onClick={onClickSubmit}>등록</button>
      </div>
    </div>
  );
};

export default CommentSection;
