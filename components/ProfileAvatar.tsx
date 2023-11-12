import Image from 'next/image';

interface ProfileAvatarProps {
  src: string | null | undefined;
  size: number;
}

const ProfileAvatar = (props: ProfileAvatarProps) => {
  const { src, size }: ProfileAvatarProps = props;
  if (!src) {
    return (
      <div
        style={{
          borderRadius: '50%',
          height: size,
          width: size,
          backgroundColor: '#CCC',
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={'profile image'}
      height={size}
      width={size}
      style={{
        borderRadius: '50%',
      }}
    />
  );
};

export default ProfileAvatar;
