'use client';

import React from 'react';
import { signOut } from 'next-auth/react';

export const LogoutButton = () => {
  return (
    <button onClick={() => signOut()}>
      로그아웃
    </button>
  );
};
