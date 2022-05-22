import { ReactNode } from 'react';
import Head from 'next/head';
import { Toast } from '@syncit/core/components';
import { useRouter } from 'next/router';

export interface LayoutProps {
  title: string
  children: ReactNode,
}

export function Layout({ children, title }: LayoutProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="min-h-screen bg-gray-100">
        {router?.pathname?.search('auth') === -1
          ? (
            <div className="drawer drawer-mobile">
              <input id="drawer" type="checkbox" className="drawer-toggle" />
              <div className="drawer-content flex flex-col items-center justify-center">
                {children}
              </div>
              <div className="drawer-side shadow-lg">
                <ul className="menu p-4 overflow-y-auto w-60 bg-base-100 text-base-content">
                  <li>Sidebar Item 1</li>
                  <li>Sidebar Item 2</li>
                </ul>
              </div>

            </div>
          )
          : children}
      </div>
      <Toast />
    </>
  );
}

export default Layout;
