import styles from '@/app/layout.module.css';
import Link from 'next/link';
import { LoginButton } from '@/components/LoginButton';
import { LogoutButton } from '@/components/LogoutButton';
import React from 'react';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ProfileAvatar from '@/components/ProfileAvatar';

const Header = async () => {
  const session: Session | null = await getServerSession(authOptions);

  return (
    <div className={styles.background}>
      <div className={`page-container ${styles.navbar}`}>
        <div className={styles.tabs}>
          <Link href='/' className={styles.logo}>Chocommunity</Link>
          <Link href={'/posts'}>Posts</Link>
        </div>
        <div className={styles.tabs}>
          {session && <ProfileAvatar src={session.user?.image} size={40} />}
          {session == null ?
            <LoginButton /> :
            <LogoutButton />
          }
        </div>
      </div>
    </div>
  );
};

export default Header;
