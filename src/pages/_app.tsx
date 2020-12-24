import type { AppProps } from 'next/app';

import './_app.scss';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
