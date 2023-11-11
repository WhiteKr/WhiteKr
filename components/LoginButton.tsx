'use client';

import React from 'react';
import { signIn } from 'next-auth/react';

export const LoginButton = () => {
  return (
    <button onClick={() => signIn()}>
      로그인
    </button>
  );
};
