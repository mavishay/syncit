import { AppProps } from 'next/app';
import './styles.css';
import { RecoilRoot } from 'recoil';
import { AuthGuard } from '@syncit/core/components';

function CustomApp({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return (
    <RecoilRoot>
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </RecoilRoot>
  );
}

export default CustomApp;
