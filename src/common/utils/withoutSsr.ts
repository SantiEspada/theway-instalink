import dynamic from 'next/dynamic';
import { Component } from 'react';

export function withoutSsr(component: () => JSX.Element) {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
  });
}
