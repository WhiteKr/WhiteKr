import React from 'react';
import Link from 'next/link';
import { LoginButton } from '@/components/LoginButton';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { LogoutButton } from '@/components/LogoutButton';

import './global.css';
import styles from './layout.module.css';

export const metadata = {
  title: 'Chocommunity',
  description: 'by WhiteKr',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session: Session | null = await getServerSession(authOptions);

  return (
    <html lang='en'>
    <body>
    <div className={styles.navbar}>
      <div className={styles.tabs}>
        <Link href='/' className={styles.logo}>Chocommunity</Link>
        <Link href={'/posts'}>Posts</Link>
      </div>
      <div className={styles.tabs}>
        {session == null ?
          <LoginButton /> :
          <LogoutButton />
        }
      </div>
    </div>
    {children}
    </body>
    </html>
  );
};
export default RootLayout;
