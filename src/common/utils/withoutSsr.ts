import dynamic from 'next/dynamic';

export function withoutSsr(Component: () => JSX.Element) {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
  });
}
