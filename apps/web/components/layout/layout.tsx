import { ReactNode } from 'react';
import Head from 'next/head';

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
      {children}
    </>
  );
}

export default Layout;
