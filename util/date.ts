export const timeForToday = (date: Date) => {
  if (!date) return '';

  const today: Date = new Date();
  const timeValue: Date = new Date(date);

  const betweenTime: number = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
  if (betweenTime < 1) return '방금 전';
  if (betweenTime < 60) {
    return `${betweenTime}분 전`;
  }

  const betweenTimeHour: number = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간 전`;
  }

  const betweenTimeDay: number = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일 전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년 전`;
};
