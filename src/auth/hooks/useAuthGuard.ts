import { useEffect } from 'react';

import { useAuth } from './useAuth';

useAuthGuard.DEFAULT_REDIRECT_URL = '/auth/login';

export function useAuthGuard(
  redirectUrl: string = useAuthGuard.DEFAULT_REDIRECT_URL,
  shouldRedirectWhenLoggedOut: boolean = true
) {
  function authGuard(element: JSX.Element) {
    const { isLoggedIn } = useAuth();

    const shouldRedirect = shouldRedirectWhenLoggedOut && !isLoggedIn;

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
