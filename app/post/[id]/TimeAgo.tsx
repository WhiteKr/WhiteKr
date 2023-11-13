import { timeAgo } from '@/util/date';

interface TimeAgoProps {
  prefix?: string;
  suffix?: string;
  timestamp: Date | undefined;
}

export const TimeAgo = (props: TimeAgoProps) => {
  const {
    prefix,
    suffix,
    timestamp,
  }: TimeAgoProps = props;

  if (!timestamp) return null;

  return (
    <div>
      <p>{prefix} {timeAgo(timestamp)} {suffix}</p>
    </div>
  );
};