import React from 'react';

import './global.css';
import Header from '@/components/Header';

export const metadata = {
  title: 'Chocommunity',
  description: 'by WhiteKr',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en'>
    <body>
    <Header />
    {children}
    </body>
    </html>
  );
};
export default RootLayout;
