import { useEffect } from 'react';

import { useAuth } from './useAuth';

export interface useAuthGuardArgs {
  redirectUrl?: string;
  isLogin?: boolean;
}

useAuthGuard.DEFAULT_REDIRECT_URL = '/auth/login';

export function useAuthGuard(args: useAuthGuardArgs = {}) {
  const { redirectUrl = useAuthGuard.DEFAULT_REDIRECT_URL, isLogin = false } =
    args;

  function authGuard(element: JSX.Element) {
    const { isLoggedIn } = useAuth();

    const shouldRedirect = (isLogin && isLoggedIn) || (!isLogin && !isLoggedIn);

    useEffect(() => {
      if (shouldRedirect) {
        window.location.replace(redirectUrl);
      }
    }, [isLoggedIn]);

    return shouldRedirect ? null : element;
  }

  return {
    authGuard,
  };
}
