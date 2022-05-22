import { ReactNode } from 'react';
import Head from 'next/head';
import { Toast } from '@syncit/core/components';

export interface LayoutProps {
  title: string
  children: ReactNode,
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="min-h-screen bg-gray-100">
        {children}
      </div>
      <Toast />
    </>
  );
}

export default Layout;
