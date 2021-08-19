import { useEffect } from 'react';
import { useAuth } from './useAuth';

useAuthGuard.DEFAULT_REDIRECT_URL = '/auth/login';

export function useAuthGuard(
  redirectUrl: string = useAuthGuard.DEFAULT_REDIRECT_URL
) {
  function authGuard(element: JSX.Element) {
    const { isLoggedIn } = useAuth();

    useEffect(() => {
      if (!isLoggedIn) {
        window.location.replace(redirectUrl);
      }
    }, [isLoggedIn]);

    return isLoggedIn ? element : null;
  }

  return {
    authGuard,
  };
}
