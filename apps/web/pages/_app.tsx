import { AppProps } from 'next/app';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />;
}

export default CustomApp;
