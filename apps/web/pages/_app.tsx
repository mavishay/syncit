import { AppProps } from 'next/app';
import './styles.css';
import { useRouter } from 'next/router';
import { useAuth } from '@syncit/core/hooks';
import { useEffect } from 'react';

function CustomApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const checkLoggedIn = async () => {
      if (router.pathname.search('/auth') === -1) {
        const approved = await isLoggedIn();
        if (!approved) {
          router.replace('/auth/login');
        }
      }
    };
    checkLoggedIn();
  }, [router]);

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />;
}

export default CustomApp;
